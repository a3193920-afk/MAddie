import os
import sqlite3
import hashlib
import json
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Tuple

DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
DB_PATH = os.path.join(DB_DIR, "maddy.db")

def hash_password(password: str, salt: str = "maddy_salt_2026") -> str:
    """Secure SHA-256 password hash with salt."""
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

class DBService:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self._init_db()

    def get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        """Initialize all relational tables if they do not exist."""
        with self.get_connection() as conn:
            cursor = conn.cursor()

            # 1. Users table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                age INTEGER NOT NULL,
                gender TEXT NOT NULL,
                college TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)

            # 2. Emergency Contacts table (Family, Friends, Wardens)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS emergency_contacts (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                relation TEXT NOT NULL,
                phone TEXT NOT NULL,
                is_primary INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
            """)

            # 3. Menstrual Cycle Logs (for female users)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS menstrual_logs (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                start_date TEXT NOT NULL,
                end_date TEXT,
                cycle_length INTEGER DEFAULT 28,
                period_duration INTEGER DEFAULT 5,
                symptoms TEXT, -- JSON array of strings: cramps, bloating, mood_swings, etc.
                flow_intensity TEXT, -- light, medium, heavy
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
            """)

            # 4. Daily Check-ins
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS checkins (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                mood INTEGER NOT NULL,
                stress INTEGER NOT NULL,
                energy INTEGER NOT NULL,
                sleep TEXT NOT NULL,
                stressors TEXT, -- JSON array
                notes TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)

            # 5. Chat History
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS chat_history (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                role TEXT NOT NULL, -- user or assistant
                content TEXT NOT NULL,
                mode TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)

            # 6. Journal Entries
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS journal_entries (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                title TEXT,
                content TEXT NOT NULL,
                mood_tag TEXT,
                encrypted INTEGER DEFAULT 1,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)

            # 7. Recovery Feedback & Personal Manual
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_recovery_profile (
                user_id TEXT PRIMARY KEY,
                what_helps TEXT, -- JSON array
                what_hurts TEXT, -- JSON array
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)

            conn.commit()

        # Seed default demo users if empty
        self._seed_default_users()

    def _seed_default_users(self):
        """Seed realistic demo profiles: Ananya (Female, 20) and Rohan (Male, 21)."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM users")
            count = cursor.fetchone()[0]
            if count == 0:
                demo_pass = hash_password("maddy123")
                
                # Demo User 1: Ananya (Female, has cycle logs & family contacts)
                cursor.execute("""
                INSERT INTO users (id, name, email, password_hash, age, gender, college)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """, ("usr_ananya", "Ananya Sen", "ananya@campus.edu", demo_pass, 20, "female", "IIT Kharagpur / JU, 3rd Year"))

                # Ananya's family contacts
                cursor.execute("""
                INSERT INTO emergency_contacts (id, user_id, name, relation, phone, is_primary)
                VALUES (?, ?, ?, ?, ?, ?)
                """, ("c_1", "usr_ananya", "Maa (Mom)", "Mother", "+91 98301 23456", 1))
                cursor.execute("""
                INSERT INTO emergency_contacts (id, user_id, name, relation, phone, is_primary)
                VALUES (?, ?, ?, ?, ?, ?)
                """, ("c_2", "usr_ananya", "Diya (Roommate)", "Best Friend", "+91 98765 43210", 0))

                # Ananya's Menstrual Cycle (Period started 22 days ago -> in Luteal / PMS phase!)
                past_start = (datetime.now() - timedelta(days=22)).strftime("%Y-%m-%d")
                past_end = (datetime.now() - timedelta(days=17)).strftime("%Y-%m-%d")
                cursor.execute("""
                INSERT INTO menstrual_logs (id, user_id, start_date, end_date, cycle_length, period_duration, symptoms, flow_intensity, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    "m_1", 
                    "usr_ananya", 
                    past_start, 
                    past_end, 
                    28, 
                    5, 
                    json.dumps(["Mood Swings", "Tender Breasts", "Low Energy", "Crying Spells"]),
                    "medium", 
                    "Heavy placement stress making PMS symptoms feel amplified."
                ))

                # Demo User 2: Rohan (Male, 21)
                cursor.execute("""
                INSERT INTO users (id, name, email, password_hash, age, gender, college)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """, ("usr_rohan", "Rohan Roy", "rohan@campus.edu", demo_pass, 21, "male", "Jadavpur University, 4th Year"))

                cursor.execute("""
                INSERT INTO emergency_contacts (id, user_id, name, relation, phone, is_primary)
                VALUES (?, ?, ?, ?, ?, ?)
                """, ("c_3", "usr_rohan", "Baba (Dad)", "Father", "+91 98311 98765", 1))

                conn.commit()

    # ---------------- USER AUTHENTICATION ----------------
    def create_user(self, name: str, email: str, password: str, age: int, gender: str, college: Optional[str] = None) -> Dict[str, Any]:
        email_clean = email.strip().lower()
        pwd_hash = hash_password(password)
        user_id = f"usr_{hashlib.md5(email_clean.encode()).hexdigest()[:10]}"

        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM users WHERE email = ?", (email_clean,))
            if cursor.fetchone():
                raise ValueError("An account with this email already exists.")

            cursor.execute("""
            INSERT INTO users (id, name, email, password_hash, age, gender, college)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (user_id, name.strip(), email_clean, pwd_hash, age, gender.strip().lower(), college or "Campus Scholar"))
            conn.commit()

        return self.get_user_by_id(user_id)

    def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        email_clean = email.strip().lower()
        pwd_hash = hash_password(password)

        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT id, name, email, age, gender, college, created_at
            FROM users WHERE email = ? AND password_hash = ?
            """, (email_clean, pwd_hash))
            row = cursor.fetchone()
            if row:
                return dict(row)
        return None

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT id, name, email, age, gender, college, created_at
            FROM users WHERE id = ?
            """, (user_id,))
            row = cursor.fetchone()
            if row:
                return dict(row)
        return None

    def update_user_profile(self, user_id: str, name: str, age: int, gender: str, college: Optional[str] = None) -> Dict[str, Any]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            UPDATE users SET name = ?, age = ?, gender = ?, college = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """, (name.strip(), age, gender.strip().lower(), college, user_id))
            conn.commit()
        return self.get_user_by_id(user_id)

    # ---------------- EMERGENCY CONTACTS ----------------
    def get_emergency_contacts(self, user_id: str) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT id, user_id, name, relation, phone, is_primary, created_at
            FROM emergency_contacts WHERE user_id = ?
            ORDER BY is_primary DESC, created_at ASC
            """, (user_id,))
            return [dict(r) for r in cursor.fetchall()]

    def add_emergency_contact(self, user_id: str, name: str, relation: str, phone: str, is_primary: bool = False) -> Dict[str, Any]:
        contact_id = f"c_{int(datetime.now().timestamp()*1000)}"
        with self.get_connection() as conn:
            cursor = conn.cursor()
            if is_primary:
                cursor.execute("UPDATE emergency_contacts SET is_primary = 0 WHERE user_id = ?", (user_id,))
            cursor.execute("""
            INSERT INTO emergency_contacts (id, user_id, name, relation, phone, is_primary)
            VALUES (?, ?, ?, ?, ?, ?)
            """, (contact_id, user_id, name.strip(), relation.strip(), phone.strip(), 1 if is_primary else 0))
            conn.commit()

        return {
            "id": contact_id,
            "user_id": user_id,
            "name": name,
            "relation": relation,
            "phone": phone,
            "is_primary": is_primary
        }

    def delete_emergency_contact(self, user_id: str, contact_id: str) -> bool:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM emergency_contacts WHERE id = ? AND user_id = ?", (contact_id, user_id))
            conn.commit()
            return cursor.rowcount > 0

    # ---------------- MENSTRUAL CYCLE ENGINE ----------------
    def log_menstrual_cycle(
        self,
        user_id: str,
        start_date: str,
        end_date: Optional[str] = None,
        cycle_length: int = 28,
        period_duration: int = 5,
        symptoms: Optional[List[str]] = None,
        flow_intensity: str = "medium",
        notes: Optional[str] = None
    ) -> Dict[str, Any]:
        log_id = f"m_{int(datetime.now().timestamp()*1000)}"
        symptoms_json = json.dumps(symptoms or [])

        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO menstrual_logs (id, user_id, start_date, end_date, cycle_length, period_duration, symptoms, flow_intensity, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (log_id, user_id, start_date, end_date, cycle_length, period_duration, symptoms_json, flow_intensity, notes))
            conn.commit()

        return self.predict_cycle_phase(user_id)

    def get_menstrual_history(self, user_id: str) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT id, user_id, start_date, end_date, cycle_length, period_duration, symptoms, flow_intensity, notes, created_at
            FROM menstrual_logs WHERE user_id = ?
            ORDER BY start_date DESC
            """, (user_id,))
            rows = cursor.fetchall()
            result = []
            for r in rows:
                d = dict(r)
                try:
                    d['symptoms'] = json.loads(d['symptoms']) if d['symptoms'] else []
                except Exception:
                    d['symptoms'] = []
                result.append(d)
            return result

    def predict_cycle_phase(self, user_id: str) -> Dict[str, Any]:
        """
        Calculates current day of menstrual cycle, active hormonal phase,
        days until next period, and predictive emotional/physiological impact.
        """
        history = self.get_menstrual_history(user_id)
        if not history:
            return {
                "has_data": False,
                "message": "No cycle data logged yet. Add your last period start date to track phases and emotional patterns."
            }

        latest = history[0]
        try:
            start_dt = datetime.strptime(latest["start_date"], "%Y-%m-%d")
        except ValueError:
            return {"has_data": False, "message": "Invalid date format"}

        today = datetime.now()
        days_since_start = (today - start_dt).days
        cycle_len = latest.get("cycle_length", 28) or 28
        period_dur = latest.get("period_duration", 5) or 5

        # Current cycle day (1-indexed within cycle length)
        current_day = (days_since_start % cycle_len) + 1
        days_until_next = cycle_len - current_day
        next_period_dt = today + timedelta(days=days_until_next)

        # Hormonal Phase Classification
        if 1 <= current_day <= period_dur:
            phase_key = "menstrual"
            phase_name = "Menstrual Phase"
            emotional_climate = "Vulnerable & Fatigued (Hormones at lowest baseline)"
            mood_swing_risk = "Moderate (Physical cramps and low energy can drain patience)"
            self_care_tip = "Keep warm with chai or hot water, rest your body, avoid harsh self-criticism, and do gentle stretches."
            is_pms = False
        elif (period_dur + 1) <= current_day <= 13:
            phase_key = "follicular"
            phase_name = "Follicular Phase"
            emotional_climate = "Rising Energy & Mental Clarity (Estrogen increasing)"
            mood_swing_risk = "Low (Good window for creative work, problem solving, and social connection)"
            self_care_tip = "Take advantage of natural focus for study sprints and organizing your weekly tasks."
            is_pms = False
        elif 14 <= current_day <= 16:
            phase_key = "ovulatory"
            phase_name = "Ovulatory Phase"
            emotional_climate = "Peak Confidence & Social Openness (Peak estrogen & LH surge)"
            mood_swing_risk = "Low (Highest natural resilience and expressive energy)"
            self_care_tip = "Great time to connect with friends, tackle tough presentations, or initiate difficult conversations."
            is_pms = False
        else: # 17 to cycle_len
            phase_key = "luteal"
            phase_name = "Luteal / Premenstrual Phase"
            emotional_climate = "High Sensitivity & Emotional Vulnerability (Progesterone rising and then plunging)"
            mood_swing_risk = "High (Sudden crying spells, irritation with roommates, feeling like a failure)"
            self_care_tip = "Hormones naturally amplify emotional weight right now. You are NOT broken or failing; treat yourself with utmost warmth."
            is_pms = True

        return {
            "has_data": True,
            "current_day": current_day,
            "cycle_length": cycle_len,
            "period_duration": period_dur,
            "phase_key": phase_key,
            "phase_name": phase_name,
            "is_pms": is_pms,
            "days_until_next_period": days_until_next,
            "predicted_next_date": next_period_dt.strftime("%Y-%m-%d"),
            "emotional_climate": emotional_climate,
            "mood_swing_risk": mood_swing_risk,
            "self_care_tip": self_care_tip,
            "recent_symptoms": latest.get("symptoms", []),
            "last_start_date": latest["start_date"]
        }

    # ---------------- CHECK-INS & PREDICTIVE ANALYTICS ----------------
    def add_checkin(self, user_id: Optional[str], mood: int, stress: int, energy: int, sleep: str, stressors: List[str], notes: Optional[str] = None) -> Dict[str, Any]:
        checkin_id = f"chk_{int(datetime.now().timestamp()*1000)}"
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO checkins (id, user_id, mood, stress, energy, sleep, stressors, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (checkin_id, user_id, mood, stress, energy, sleep, json.dumps(stressors), notes))
            conn.commit()
        return {
            "id": checkin_id,
            "user_id": user_id,
            "mood": mood,
            "stress": stress,
            "energy": energy,
            "sleep": sleep,
            "stressors": stressors,
            "notes": notes,
            "timestamp": datetime.now().isoformat()
        }

    def get_checkin_history(self, user_id: Optional[str] = None, limit: int = 20) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            if user_id:
                cursor.execute("""
                SELECT id, user_id, mood, stress, energy, sleep, stressors, notes, timestamp
                FROM checkins WHERE user_id = ? OR user_id IS NULL
                ORDER BY timestamp DESC LIMIT ?
                """, (user_id, limit))
            else:
                cursor.execute("""
                SELECT id, user_id, mood, stress, energy, sleep, stressors, notes, timestamp
                FROM checkins ORDER BY timestamp DESC LIMIT ?
                """, (limit,))

            rows = cursor.fetchall()
            res = []
            for r in reversed(rows): # chronological
                d = dict(r)
                try:
                    d['stressors'] = json.loads(d['stressors']) if d['stressors'] else []
                except Exception:
                    d['stressors'] = []
                res.append(d)
            return res

    def predict_stress_and_mood_trends(self, user_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Analyzes 7-day emotional velocity, predicts stress trajectory,
        and provides preventative recommendations.
        """
        history = self.get_checkin_history(user_id, limit=7)
        if not history:
            return {
                "avg_mood": 3.0,
                "avg_stress": 3.0,
                "trend": "stable",
                "prediction": "Maintaining baseline balance. Regular check-ins will unlock personalized trajectory forecasting."
            }

        moods = [h["mood"] for h in history]
        stresses = [h["stress"] for h in history]
        avg_mood = sum(moods) / len(moods)
        avg_stress = sum(stresses) / len(stresses)

        if len(moods) >= 3 and moods[-1] < moods[0] and stresses[-1] > stresses[0]:
            trend = "increasing_strain"
            prediction = "Noticeable emotional velocity downward over the past 3 days. Elevated probability of acute exhaustion if pace continues."
        elif len(moods) >= 3 and moods[-1] > moods[0]:
            trend = "recovering"
            prediction = "Positive recovery slope detected. Nervous system re-stabilizing after previous peak stress."
        else:
            trend = "stable"
            prediction = "Emotional baseline holds steady within normal campus variance."

        return {
            "avg_mood": round(avg_mood, 1),
            "avg_stress": round(avg_stress, 1),
            "trend": trend,
            "prediction": prediction,
            "days_recorded": len(history)
        }

    # ---------------- COMPLETE CONTEXT FOR LLM ----------------
    def get_user_full_context(self, user_id: Optional[str]) -> Dict[str, Any]:
        """
        Builds complete hyper-personalized context payload for Gemini:
        User details, cycle phase (if female), contacts, and check-in history.
        """
        if not user_id:
            return {}

        user = self.get_user_by_id(user_id)
        if not user:
            return {}

        contacts = self.get_emergency_contacts(user_id)
        contacts_summary = [f"{c['name']} ({c['relation']}): {c['phone']}" for c in contacts]

        cycle_info = {}
        if user.get("gender") == "female":
            cycle_info = self.predict_cycle_phase(user_id)

        trend = self.predict_stress_and_mood_trends(user_id)

        return {
            "user_id": user["id"],
            "name": user["name"],
            "age": user["age"],
            "gender": user["gender"],
            "college": user.get("college", "University Student"),
            "emergency_contacts": contacts_summary,
            "emergency_contacts_raw": contacts,
            "cycle_info": cycle_info,
            "recent_trend": trend
        }

# Global singleton
db_service = DBService()
