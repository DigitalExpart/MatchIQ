"""
Service for managing Amora coaching sessions, summaries, and follow-ups.
"""
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime, time, timedelta
import logging

from app.database import get_supabase_client
from app.models.db_models import AmoraSession, AmoraSessionMessage
from app.models.pydantic_models import FollowUpResponse

logger = logging.getLogger(__name__)


class AmoraSessionService:
    """Service for managing coaching sessions."""
    
    def __init__(self):
        self.supabase = get_supabase_client()
    
    def get_session(self, user_id: UUID, session_id: UUID) -> Optional[AmoraSession]:
        """Get a session by ID, verifying it belongs to the user."""
        try:
            response = self.supabase.table("amora_sessions") \
                .select("*") \
                .eq("id", str(session_id)) \
                .eq("user_id", str(user_id)) \
                .single() \
                .execute()
            
            if response.data:
                return AmoraSession.from_dict(response.data)
            return None
        except Exception as e:
            logger.error(f"Error getting session: {e}")
            return None
    
    def save_message(
        self,
        session_id: UUID,
        sender: str,
        message_text: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> UUID:
        """Save a message to a session."""
        try:
            message_data = {
                "session_id": str(session_id),
                "sender": sender,
                "message_text": message_text,
                "metadata": metadata or {}
            }
            
            response = self.supabase.table("amora_session_messages") \
                .insert(message_data) \
                .execute()
            
            if response.data:
                message_id = UUID(response.data[0]["id"])
                
                # Update session's last_message_at
                self.supabase.table("amora_sessions") \
                    .update({
                        "last_message_at": datetime.now().isoformat(),
                        "updated_at": datetime.now().isoformat()
                    }) \
                    .eq("id", str(session_id)) \
                    .execute()
                
                return message_id
            raise Exception("Failed to save message")
        except Exception as e:
            logger.error(f"Error saving message: {e}", exc_info=True)
            raise
    
    def update_session_topic(
        self,
        session_id: UUID,
        primary_topic: str
    ):
        """Update the primary topic of a session if it's not set."""
        try:
            # Check if topic is already set
            response = self.supabase.table("amora_sessions") \
                .select("primary_topic") \
                .eq("id", str(session_id)) \
                .single() \
                .execute()
            
            if response.data and not response.data.get("primary_topic"):
                self.supabase.table("amora_sessions") \
                    .update({
                        "primary_topic": primary_topic,
                        "updated_at": datetime.now().isoformat()
                    }) \
                    .eq("id", str(session_id)) \
                    .execute()
        except Exception as e:
            logger.error(f"Error updating session topic: {e}")
    
    def generate_summary(
        self,
        session_id: UUID,
        topics: List[str],
        recent_messages: List[AmoraSessionMessage],
        emotions: Optional[List[str]] = None
    ) -> tuple[str, str]:
        """
        Generate summary_text and next_plan_text for a session.
        
        Returns:
            (summary_text, next_plan_text)
        """
        try:
            # Get session info
            session_response = self.supabase.table("amora_sessions") \
                .select("title, primary_topic") \
                .eq("id", str(session_id)) \
                .single() \
                .execute()
            
            session_title = session_response.data.get("title", "this session") if session_response.data else "this session"
            primary_topic = session_response.data.get("primary_topic") if session_response.data else (topics[0] if topics else "relationships")
            
            # Extract key themes from recent user messages
            user_messages = [msg.message_text for msg in recent_messages if msg.sender == "user"]
            key_facts = []
            if user_messages:
                # Take first 2-3 key facts from user messages
                for msg in user_messages[:3]:
                    # Extract first sentence or first 100 chars
                    fact = msg.split('.')[0].strip()[:100]
                    if fact:
                        key_facts.append(fact)
            
            # Build summary
            summary_parts = []
            summary_parts.append(f"We've been exploring your {primary_topic} and how it affects your relationships.")
            
            if key_facts:
                facts_text = ", ".join(key_facts[:2])
                summary_parts.append(f"You mentioned: {facts_text}.")
            
            if emotions:
                top_emotions = emotions[:2]
                if top_emotions:
                    summary_parts.append(f"The main feelings that have shown up are {', '.join(top_emotions)}.")
            
            # What we've explored
            if topics:
                explored = ", ".join(topics[:3])
                summary_parts.append(f"So far, we've focused on {explored}.")
            
            summary_text = " ".join(summary_parts)
            
            # Build next plan
            next_plan_parts = []
            next_plan_parts.append(f"Next, we're focusing on {primary_topic}, at your pace.")
            
            if topics and len(topics) > 1:
                next_topics = topics[1:3]
                next_plan_parts.append(f"This might include exploring {', '.join(next_topics)}")
            
            next_plan_parts.append("and noticing how these patterns show up in your relationships.")
            next_plan_text = " ".join(next_plan_parts)
            
            return summary_text, next_plan_text
        except Exception as e:
            logger.error(f"Error generating summary: {e}", exc_info=True)
            # Fallback summaries
            primary_topic = topics[0] if topics else "relationships"
            return (
                f"We've been exploring your {primary_topic} and how it affects your relationships.",
                f"Next, we'll continue exploring {primary_topic} at your pace."
            )
    
    def update_session_summary(
        self,
        session_id: UUID,
        summary_text: str,
        next_plan_text: str
    ):
        """Update the summary fields of a session."""
        try:
            self.supabase.table("amora_sessions") \
                .update({
                    "summary_text": summary_text,
                    "next_plan_text": next_plan_text,
                    "updated_at": datetime.now().isoformat()
                }) \
                .eq("id", str(session_id)) \
                .execute()
        except Exception as e:
            logger.error(f"Error updating session summary: {e}")
    
    def get_recent_messages(
        self,
        session_id: UUID,
        limit: int = 10
    ) -> List[AmoraSessionMessage]:
        """Get recent messages from a session."""
        try:
            response = self.supabase.table("amora_session_messages") \
                .select("*") \
                .eq("session_id", str(session_id)) \
                .order("created_at", desc=False) \
                .limit(limit) \
                .execute()
            
            messages = []
            for row in response.data:
                messages.append(AmoraSessionMessage.from_dict(row))
            
            return messages
        except Exception as e:
            logger.error(f"Error getting recent messages: {e}")
            return []
    
    def should_update_summary(
        self,
        session_id: UUID
    ) -> bool:
        """Check if we should update the summary (e.g., every 4-6 user messages)."""
        try:
            # Count user messages since last summary update
            response = self.supabase.table("amora_session_messages") \
                .select("id", count="exact") \
                .eq("session_id", str(session_id)) \
                .eq("sender", "user") \
                .execute()
            
            user_message_count = response.count if hasattr(response, 'count') else len(response.data)
            
            # Update summary every 4-6 messages
            return user_message_count > 0 and user_message_count % 5 == 0
        except Exception as e:
            logger.error(f"Error checking if should update summary: {e}")
            return False
    
    def get_due_followups(self, user_id: UUID) -> List[FollowUpResponse]:
        """
        Get sessions that are due for a daily follow-up.
        
        Logic:
        - Session must have follow_up_enabled = true
        - Session must be ACTIVE
        - Current time must be after follow_up_time
        - last_follow_up_at must be before today's follow_up_time
        """
        try:
            now = datetime.now()
            current_time_str = now.strftime("%H:%M")
            
            # Get all active sessions with follow-ups enabled
            response = self.supabase.table("amora_sessions") \
                .select("*") \
                .eq("user_id", str(user_id)) \
                .eq("status", "ACTIVE") \
                .eq("follow_up_enabled", True) \
                .execute()
            
            followups = []
            for row in response.data:
                session = AmoraSession.from_dict(row)
                
                if not session.follow_up_time:
                    continue
                
                # Parse follow_up_time (HH:MM)
                try:
                    follow_up_hour, follow_up_minute = map(int, session.follow_up_time.split(":"))
                    follow_up_time_obj = time(follow_up_hour, follow_up_minute)
                    current_time_obj = time(now.hour, now.minute)
                except:
                    continue
                
                # Check if current time is after follow-up time
                if current_time_obj < follow_up_time_obj:
                    continue
                
                # Check if we've already sent a follow-up today
                if session.last_follow_up_at:
                    last_follow_up = session.last_follow_up_at
                    # If last follow-up was today, skip
                    if last_follow_up.date() == now.date():
                        continue
                
                # Generate check-in prompt
                prompt = self._generate_followup_prompt(session)
                
                followups.append(FollowUpResponse(
                    coach_session_id=session.id,
                    title=session.title,
                    primary_topic=session.primary_topic,
                    prompt=prompt
                ))
            
            return followups
        except Exception as e:
            logger.error(f"Error getting due followups: {e}", exc_info=True)
            return []
    
    def _generate_followup_prompt(self, session: AmoraSession) -> str:
        """Generate a check-in prompt for a session."""
        topic = session.primary_topic or "what we've been working on"
        title = session.title
        
        if session.summary_text:
            # Use summary to create personalized prompt
            return f"Last time we talked about {title} and {session.summary_text[:100]}... How have you been feeling about this since we last spoke?"
        else:
            return f"Last time we talked about {title} and your {topic}. How have you been feeling about this since we last spoke?"
    
    def mark_followup_sent(self, session_id: UUID):
        """Mark that a follow-up was sent for a session."""
        try:
            self.supabase.table("amora_sessions") \
                .update({
                    "last_follow_up_at": datetime.now().isoformat(),
                    "updated_at": datetime.now().isoformat()
                }) \
                .eq("id", str(session_id)) \
                .execute()
        except Exception as e:
            logger.error(f"Error marking followup sent: {e}")
