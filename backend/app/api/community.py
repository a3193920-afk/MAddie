import uuid
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.safety_service import safety_service

router = APIRouter(prefix="/api/community", tags=["Anonymous Community"])

class NewPostRequest(BaseModel):
    category: str
    content: str
    author_alias: str = "Anonymous Owl"

# Pre-seeded anonymous community posts
COMMUNITY_POSTS: List[Dict[str, Any]] = [
    {
        "id": "post_1",
        "category": "Exam stress",
        "author_alias": "Anonymous Falcon",
        "author_avatar": "🦅",
        "timestamp": "2 hours ago",
        "content": "To anyone freaking out about tomorrow's Database exam: remember that everyone in the lecture hall is feeling equally overwhelmed. Just review indexing and SQL joins. We got this!",
        "reactions": {"hug": 24, "relate": 42, "strength": 19},
        "support_replies": 8
    },
    {
        "id": "post_2",
        "category": "Hostel life",
        "author_alias": "Anonymous Otter",
        "author_avatar": "🦦",
        "timestamp": "5 hours ago",
        "content": "First semester in the hostel was so lonely for me. If you're eating alone at the mess hall today, remember it takes time to find your people. It gets significantly better after mid-sem.",
        "reactions": {"hug": 58, "relate": 37, "strength": 29},
        "support_replies": 14
    },
    {
        "id": "post_3",
        "category": "Placement pressure",
        "author_alias": "Anonymous Panda",
        "author_avatar": "🐼",
        "timestamp": "Yesterday",
        "content": "Got rejected in the final round of an on-campus drive. Felt like my world ended for 24 hours. Took a long walk, talked to a senior, and realized this is just round 1 of a 40-year career.",
        "reactions": {"hug": 83, "relate": 64, "strength": 51},
        "support_replies": 22
    }
]

@router.get("")
async def get_posts():
    return COMMUNITY_POSTS

@router.post("")
async def create_post(post: NewPostRequest):
    # Deterministic Safety Screening on Community Posts
    verdict = safety_service.evaluate_safety(post.content)
    if verdict.hard_stop:
        raise HTTPException(
            status_code=400,
            detail="Your post contains language indicating acute distress or crisis. For your safety, please reach out directly to 24/7 support at Tele-MANAS (14416) or campus counselors."
        )

    new_p = {
        "id": f"post_{len(COMMUNITY_POSTS)+1}",
        "category": post.category,
        "author_alias": post.author_alias,
        "author_avatar": "🌿",
        "timestamp": "Just now",
        "content": post.content,
        "reactions": {"hug": 1, "relate": 1, "strength": 0},
        "support_replies": 0
    }
    COMMUNITY_POSTS.insert(0, new_p)
    return new_p

@router.post("/{post_id}/react")
async def react_to_post(post_id: str, reaction_type: str = "relate"):
    for p in COMMUNITY_POSTS:
        if p["id"] == post_id:
            if reaction_type in p["reactions"]:
                p["reactions"][reaction_type] += 1
            else:
                p["reactions"][reaction_type] = 1
            return p["reactions"]
    return {}
