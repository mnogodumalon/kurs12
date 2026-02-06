"""
Claude Agent for Design Phase (Step 1 of 2)
Creates design_brief.md only. No code, no LivingApps.
Deploy is used ONLY to save design_brief.md to the repo.
"""
import asyncio
import json
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, AssistantMessage, ToolUseBlock, TextBlock, ResultMessage, create_sdk_mcp_server, tool
import subprocess
import os
from pathlib import Path


async def main():
    def run_git_cmd(cmd: str):
        """Executes a Git command and throws an error on failure"""
        print(f"[DEPLOY] Executing: {cmd}")
        result = subprocess.run(
            cmd,
            shell=True,
            cwd="/home/user/app",
            capture_output=True,
            text=True
        )
        if result.returncode != 0:
            raise Exception(f"Git Error ({cmd}): {result.stderr}")
        return result.stdout

    @tool("deploy_to_github",
    "Saves design_brief.md to the repository. Call this when design_brief.md is complete.",
    {})
    async def deploy_to_github(args):
        try:
            run_git_cmd("git config --global user.email 'lilo@livinglogic.de'")
            run_git_cmd("git config --global user.name 'Lilo'")
            
            git_push_url = os.getenv('GIT_PUSH_URL')
            
            # Check if repo exists and take .git history
            try:
                run_git_cmd(f"git clone {git_push_url} /tmp/old_repo")
                run_git_cmd("cp -r /tmp/old_repo/.git /home/user/app/.git")
            except:
                run_git_cmd("git init")
                run_git_cmd("git checkout -b main")
                run_git_cmd(f"git remote add origin {git_push_url}")
            
            run_git_cmd("git add -A")
            subprocess.run("git add -f .claude ':!.claude/debug' .claude_session_id 2>/dev/null", shell=True, cwd="/home/user/app")
            run_git_cmd("git commit -m 'Design Brief erstellt' --allow-empty")
            run_git_cmd("git push origin main")
            
            print("[DEPLOY] ✅ Design Brief gespeichert!")

            return {
                "content": [{"type": "text", "text": "✅ design_brief.md erfolgreich im Repository gespeichert!"}]
            }

        except Exception as e:
            return {"content": [{"type": "text", "text": f"Deployment Failed: {str(e)}"}], "is_error": True}

    # ============================================================
    # MCP SERVER - Design phase only needs deploy
    # ============================================================
    dashboard_tools_server = create_sdk_mcp_server(
        name="dashboard_tools",
        version="1.0.0",
        tools=[deploy_to_github]
    )

    options = ClaudeAgentOptions(
        system_prompt={
            "type": "preset",
            "preset": "claude_code"
        },
        setting_sources=["project"],
        mcp_servers={"dashboard_tools": dashboard_tools_server},
        permission_mode="acceptEdits",
        allowed_tools=[
            "Bash", "Write", "Read", "Edit", "Glob", "Grep", "Task", "TodoWrite",
            "mcp__dashboard_tools__deploy_to_github"
        ],
        cwd="/home/user/app",
        model="claude-opus-4-5-20251101",
    )

    # Session-Resume support
    resume_session_id = os.getenv('RESUME_SESSION_ID')
    if resume_session_id:
        options.resume = resume_session_id
        print(f"[DESIGN] Resuming session: {resume_session_id}")

    # User prompt
    user_prompt = None
    prompt_file = "/home/user/app/.user_prompt"
    if os.path.exists(prompt_file):
        try:
            with open(prompt_file, 'r') as f:
                user_prompt = f.read().strip()
            if user_prompt:
                print(f"[DESIGN] Prompt aus Datei gelesen: {len(user_prompt)} Zeichen")
        except Exception as e:
            print(f"[DESIGN] Fehler beim Lesen der Prompt-Datei: {e}")
    
    if not user_prompt:
        user_prompt = os.getenv('USER_PROMPT', '')

    # Design-phase query
    query = f"""Du bist der Design-Agent (Schritt 1 von 2).

Deine EINZIGE Aufgabe: Erstelle eine ausführliche `design_brief.md` basierend auf der User-Anfrage.

User-Anfrage: "{user_prompt}"

REGELN:
- Erstelle NUR design_brief.md — KEINEN Code, KEINE Komponenten
- Befolge die Anleitung in CLAUDE.md exakt
- Die design_brief.md muss so detailliert sein, dass ein anderer Agent sie 1:1 umsetzen kann
- Inkludiere das Datenmodell (Section 9) mit JSON Schema für Living Apps
- Spare NICHT an Details — je mehr, desto besser
- Am Ende: Rufe deploy_to_github auf um design_brief.md zu speichern

Starte JETZT mit der Analyse der User-Anfrage!"""

    print(f"[DESIGN] Design-Phase startet mit Prompt: {user_prompt[:100]}")

    async with ClaudeSDKClient(options=options) as client:
        await client.query(query)

        async for message in client.receive_response():
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if isinstance(block, TextBlock):
                        print(json.dumps({"type": "think", "content": block.text}), flush=True)
                    elif isinstance(block, ToolUseBlock):
                        print(json.dumps({"type": "tool", "tool": block.name, "input": str(block.input)}), flush=True)

            elif isinstance(message, ResultMessage):
                status = "success" if not message.is_error else "error"
                print(f"[DESIGN] Session ID: {message.session_id}")
                
                if message.session_id:
                    try:
                        with open("/home/user/app/.claude_session_id", "w") as f:
                            f.write(message.session_id)
                    except Exception as e:
                        print(f"[DESIGN] ⚠️ Session ID Fehler: {e}")
                
                print(json.dumps({
                    "type": "result", 
                    "status": status, 
                    "cost": message.total_cost_usd,
                    "session_id": message.session_id
                }), flush=True)


if __name__ == "__main__":
    asyncio.run(main())

