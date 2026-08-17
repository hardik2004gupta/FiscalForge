"""
LangGraph advisor agent definition.

One agent. Three read-only tools. No action tools.
See CLAUDE.md §11 Agentic AI Contract.

Agent flow:
    user question
        → LangGraph ReAct loop
        → tool selection (get_cost_summary | get_resources | get_recommendations)
        → tool execution → AWS-derived structured data
        → LLM reasoning
        → grounded natural-language response
"""

from __future__ import annotations

from typing import Any

from backend.agent.prompts import SYSTEM_PROMPT
from backend.config import get_config


def create_advisor_agent() -> Any:
    """
    Build the FiscalForge LangGraph advisor agent.

    Binds the three read-only tools to the configured OpenAI model.
    Returns a compiled LangGraph runnable.
    """
    from langchain_core.tools import tool
    from langchain_openai import ChatOpenAI
    from langgraph.prebuilt import create_react_agent
    from pydantic import SecretStr

    import backend.agent.tools as _tools

    config = get_config()

    @tool
    def get_cost_summary() -> dict[str, Any]:
        """Returns current AWS spending vs. previous period, daily costs, and per-service breakdown."""
        return _tools.get_cost_summary()

    @tool
    def get_resources() -> dict[str, Any]:
        """Returns EC2 instances (with CPU utilization), RDS databases, and S3 buckets."""
        return _tools.get_resources()

    @tool
    def get_recommendations() -> dict[str, Any]:
        """Returns deterministic optimization findings with severity and estimated monthly savings."""
        return _tools.get_recommendations()

    llm = ChatOpenAI(
        model=config.openai_model,
        api_key=SecretStr(config.openai_api_key),
    )

    return create_react_agent(
        llm,
        tools=[get_cost_summary, get_resources, get_recommendations],
    )


def run_advisor(message: str) -> str:
    """
    Run a user query through the advisor agent and return the response.

    Args:
        message: The user's natural-language question.

    Returns:
        The agent's response, grounded in AWS-derived data.
    """
    from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

    agent = create_advisor_agent()
    result = agent.invoke(
        {
            "messages": [
                SystemMessage(content=SYSTEM_PROMPT),
                HumanMessage(content=message),
            ]
        }
    )

    messages = result.get("messages", [])
    for msg in reversed(messages):
        if isinstance(msg, AIMessage) and msg.content:
            return str(msg.content)

    return "I was unable to process your request."
