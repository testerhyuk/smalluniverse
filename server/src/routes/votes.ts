import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import { User } from "../entities/User";
import Post from "../entities/Post";
import Vote from "../entities/Vote";
import Comment from "../entities/Comment";

const vote = async (req:Request, res:Response) => {
    const { identifier, slug, commentIdentifier, value } = req.body;
    
    if(![-1, 0 ,1].includes(value)) {
        return res.status(400).json({ value: "-1, 0, 1의 value만 올 수 있습니다."});
    }

    try {
        const user: User = res.locals.user;
        let post: Post = await Post.findOneByOrFail({ identifier, slug});
        let vote: Vote | undefined;
        let comment: Comment;

            if(commentIdentifier) {
                comment = await Comment.findOneByOrFail({ identifier: commentIdentifier});
                vote = await Vote.findOneBy({ username: user.username, commentId: comment.id});
            } else {
                vote = await Vote.findOneBy({ username: user.username, postId: post.id});
            }

            if(!vote && value === 0 ) {
                return res.status(404).json({ error: "Vote을 찾을 수 없습니다."});
            } else if( !vote) {
                vote = new Vote();
                vote.user = user;
                vote.value = value;

                if(comment) vote.comment = comment
                else vote.post = post;
                await vote.save();
            } else if(value === 0) {
                vote.remove();
            } else if ( vote.value !== value) {
                vote.value = value;
                await vote.save();
            }

            post = await Post.findOneOrFail({
                where: {
                    identifier, slug
                }, 
                relations: ["comments", "comments.votes", "sub", "votes"]
            })

            post.setUserVote(user);
            post.comments.forEach(c => c.setUserVote(user));

            return res.json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "문제가 발생했습니다."})
    }
}

const router = Router();
router.post("/", userMiddleware, authMiddleware, vote);
export default router;