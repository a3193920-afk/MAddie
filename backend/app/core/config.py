import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Maddy"
    PROJECT_DESCRIPTION: str = "Campus Mental Wellness Companion with Deterministic Crisis Guardrails"
    VERSION: str = "1.0.0"
    
    # Environment & Server
    APP_ENV: str = os.getenv("APP_ENV", "development")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # AI Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
    
    # Official Verified Emergency / Mental Health Contacts (India verified)
    CRISIS_RESOURCES = [
        {
            "id": "tele-manas",
            "name": "Tele-MANAS (Govt of India 24/7)",
            "number": "14416",
            "toll_free": "1800-891-4416",
            "type": "national_mental_health",
            "description": "24/7 free tele-mental health counseling in 20+ regional languages",
            "urgent": True
        },
        {
            "id": "kiran",
            "name": "KIRAN National Mental Health Helpline",
            "number": "1800-599-0019",
            "toll_free": "1800-599-0019",
            "type": "national_mental_health",
            "description": "Dep. of Empowerment of Persons with Disabilities, MSJE, Govt of India",
            "urgent": True
        },
        {
            "id": "vandrevala",
            "name": "Vandrevala Foundation 24/7",
            "number": "+91 9999 666 555",
            "toll_free": "9999666555",
            "type": "crisis_helpline",
            "description": "24/7 free emotional and mental distress intervention",
            "urgent": True
        },
        {
            "id": "emergency-india",
            "name": "National Emergency Number",
            "number": "112",
            "toll_free": "112",
            "type": "emergency_services",
            "description": "All-in-one emergency helpline (Police, Ambulance, Fire)",
            "urgent": True
        }
    ]

    # Configurable Campus Support
    CAMPUS_RESOURCES = [
        {
            "role": "Campus Psychological Counsellor",
            "name": "Dr. Ananya Sharma (Student Wellness Wing)",
            "contact": "+91 98765 43210 / counsellor@campus.edu",
            "location": "Health & Wellness Centre, Room 104",
            "timing": "Monday - Saturday, 9 AM - 6 PM (Walk-in or Booking)",
            "type": "campus_counselling"
        },
        {
            "role": "Chief Hostel Warden / Residential Life",
            "name": "Prof. R. K. Verma",
            "contact": "+91 98765 12345 / warden.emergency@campus.edu",
            "location": "Central Hostel Admin Block",
            "timing": "24/7 on call for hostel emergencies",
            "type": "hostel_warden"
        },
        {
            "role": "Peer Support Network",
            "name": "Maddy Student Ambassadors",
            "contact": "peersupport@campus.edu",
            "location": "Student Activity Centre, Zone B",
            "timing": "Daily 6 PM - 10 PM",
            "type": "peer_support"
        }
    ]

    # Verified Kolkata Mental Health & Psychiatric Centers
    KOLKATA_RESOURCES = [
        {
            "id": "kolkata-cnmch",
            "name": "Calcutta National Medical College & Hospital (CNMCH) - Dept of Psychiatry",
            "number": "033-2284 3000",
            "toll_free": "033-2284 4000",
            "type": "hospital_psychiatry",
            "description": "24/7 psychiatric emergency, clinical psychological evaluation & outpatient support in Park Circus, Kolkata",
            "location": "32, Gorachand Road, Beniapukur, Park Circus, Kolkata - 700014",
            "urgent": True
        },
        {
            "id": "kolkata-iop-sskm",
            "name": "Institute of Psychiatry - Centre of Excellence (IPGMER & SSKM Hospital)",
            "number": "033-2223 1589",
            "toll_free": "033-2223 1589",
            "type": "centre_of_excellence",
            "description": "Premier government institute for psychological distress, youth counseling, and crisis intervention in Kolkata",
            "location": "7, D.L. Khan Road, Bhowanipore, Kolkata - 700025",
            "urgent": True
        },
        {
            "id": "kolkata-antara",
            "name": "Antara Psychiatric Hospital & Mental Health Centre",
            "number": "+91 98310 93333",
            "toll_free": "033-2437 0593",
            "type": "psychiatric_hospital",
            "description": "Renowned mental health hospital offering 24/7 emotional crisis hotline and supportive counseling",
            "location": "Dakshin Gobindapur, Kolkata - 700145",
            "urgent": True
        },
        {
            "id": "kolkata-pavlov",
            "name": "Pavlov Hospital (Mental Health Care Kolkata)",
            "number": "033-2334 3216",
            "toll_free": "033-2334 3216",
            "type": "state_mental_hospital",
            "description": "Government psychiatric facility providing clinical support and crisis intervention",
            "location": "18, Gobra Gorasthan Road, Kolkata - 700046",
            "urgent": True
        },
        {
            "id": "kolkata-mindframe",
            "name": "Mindframe Clinic (Consultant Psychologists & Therapists)",
            "number": "+91 98300 22000",
            "toll_free": "9830022000",
            "type": "therapy_clinic",
            "description": "Specialized student and youth psychotherapy for anxiety, depression, and academic burnout in Kolkata",
            "location": "Salt Lake & South Kolkata",
            "urgent": False
        }
    ]

settings = Settings()
