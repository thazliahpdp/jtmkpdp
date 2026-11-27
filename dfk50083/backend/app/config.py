from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    app_name: str = "DFK50083 Marking Dashboard"
    secret_key: str = "CHANGE-THIS-IN-PRODUCTION-USE-A-LONG-RANDOM-STRING"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480  # 8 hours

    database_url: str = "sqlite:///./dfk50083.db"
    upload_dir: str = "uploads"

    openai_api_key: str = ""
    openai_model: str = "gpt-4o"

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
