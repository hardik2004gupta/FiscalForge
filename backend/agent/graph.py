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

Phase 2: implement using LangGraph create_react_agent or StateGraph.
"""
from __future__ import annotations

from backend.agent.prompts import SYSTEM_PROMPT


def create_advisor_agent() -> object:
    """
    Build the FiscalForge LangGraph advisor agent.

    Binds the three read-only tools to the configured OpenAI model.
    Returns a compiled LangGraph runnable.

    Phase 2: implement with LangGraph + ChatOpenAI.
    """
    raise NotImplementedError("Phase 2: LangGraph agent")


def run_advisor(message: str) -> str:
    """
    Run a user query through the advisor agent and return the response.

    Args:
        message: The user's natural-language question.

    Returns:
        The agent's response, grounded in AWS-derived data.

    Phase 2: invoke the compiled agent graph.
    """
    raise NotImplementedError("Phase 2: agent invocation")
