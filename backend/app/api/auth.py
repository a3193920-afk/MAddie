from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any, Optional
from app.models.schemas import (
    UserSignupRequest,
    UserLoginRequest,
    UserProfileResponse,
    UserProfileUpdateRequest,
    EmergencyContactRequest,
    EmergencyContactResponse
)
from app.services.db_service import db_service

router = APIRouter(prefix="/api/auth", tags=["Authentication & Profile"])

@router.post("/signup", response_model=UserProfileResponse)
async def signup(payload: UserSignupRequest):
    try:
        user = db_service.create_user(
            name=payload.name,
            email=payload.email,
            password=payload.password,
            age=payload.age,
            gender=payload.gender,
            college=payload.college
        )
        # Optional initial emergency contact
        if payload.emergency_contact_name and payload.emergency_contact_phone:
            db_service.add_emergency_contact(
                user_id=user["id"],
                name=payload.emergency_contact_name,
                relation=payload.emergency_contact_relation or "Family",
                phone=payload.emergency_contact_phone,
                is_primary=True
            )
        return user
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as err:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Registration failed: {err}")

@router.post("/login", response_model=UserProfileResponse)
async def login(payload: UserLoginRequest):
    user = db_service.authenticate_user(email=payload.email, password=payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials."
        )
    return user

@router.get("/me/{user_id}", response_model=UserProfileResponse)
async def get_current_user(user_id: str):
    user = db_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.put("/profile/{user_id}", response_model=UserProfileResponse)
async def update_profile(user_id: str, payload: UserProfileUpdateRequest):
    user = db_service.update_user_profile(
        user_id=user_id,
        name=payload.name,
        age=payload.age,
        gender=payload.gender,
        college=payload.college
    )
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

# Emergency Contacts Router (can be accessed via /api/auth/contacts or /api/contacts)
@router.get("/contacts/{user_id}", response_model=List[EmergencyContactResponse])
async def list_emergency_contacts(user_id: str):
    return db_service.get_emergency_contacts(user_id)

@router.post("/contacts/{user_id}", response_model=EmergencyContactResponse)
async def add_emergency_contact(user_id: str, payload: EmergencyContactRequest):
    contact = db_service.add_emergency_contact(
        user_id=user_id,
        name=payload.name,
        relation=payload.relation,
        phone=payload.phone,
        is_primary=payload.is_primary
    )
    return contact

@router.delete("/contacts/{user_id}/{contact_id}")
async def delete_emergency_contact(user_id: str, contact_id: str):
    success = db_service.delete_emergency_contact(user_id=user_id, contact_id=contact_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
    return {"status": "success", "message": "Emergency contact removed"}
