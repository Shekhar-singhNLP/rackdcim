"""Centralized settings. Add new device connections here, not scattered across files."""

from pydantic_settings import BaseSettings


class DeviceEndpoint(BaseSettings):
    device_id: str
    vendor: str
    host: str
    port: int


class Settings(BaseSettings):
    simulator_host: str = "127.0.0.1"
    simulator_port: int = 5020
    poll_interval_sec: float = 5.0

    class Config:
        env_file = ".env"


settings = Settings()