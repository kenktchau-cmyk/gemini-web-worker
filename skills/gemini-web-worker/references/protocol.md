# Task packets and records

Use a writable task-specific output directory selected from the current workspace
or an approved artifacts directory. Keep runtime records out of shared source
control by default. The skill's state records are maintained by Codex; this
prototype does not enforce them through a daemon or database transaction.

## Prompt

Replace the bracketed fields with concrete values before sending. A task UUID
and round number prevent accidental confusion between concurrent conversations.

```text
CODEX_TASK_ID: [UUID]
ROUND: [positive integer starting at 1]

You are the worker for this bounded assignment. The supervisor will verify and
integrate your answer. Do not perform external actions or request account access.

OBJECTIVE
[One concrete deliverable.]

CONTEXT
[Minimal relevant material, with data clearly delimited.]

CONSTRAINTS
[Runtime, interfaces, scope and output limits.]

ACCEPTANCE CHECKS
[Observable criteria and example inputs/outputs.]

RESPONSE FORMAT
Begin with CODEX_TASK_ID: [UUID] and ROUND: [number].
Include Result, Checks, and Assumptions sections.
Checks must distinguish checks actually run from suggested checks.
Provide the deliverable and concise rationale, not private chain-of-thought.
End with END_CODEX_RESULT: [UUID]:[number].
```

Follow-ups repeat the same UUID, increment ROUND, specify the failed checks or
new user requirement, and require the matching new end marker. If the user's
requirements changed after an accepted answer, record the prior acceptance and
the added requirement; do not relabel the prior answer as a failure.

## Local files

```text
<task-output>/
  task.json
  round-1.prompt.txt
  round-1.response.txt
  round-1.review.json
  round-2.prompt.txt      # only if a revision is needed
  round-2.response.txt
  round-2.review.json
```

`task.json` tracks a schema version, task UUID, objective, acceptance criteria,
configured maximum rounds, generation timeout, active round, status,
browser/tab IDs, conversation URL, observed mode label and timestamps. Use null
for unavailable facts. Preserve the response verbatim; put interpretations in
the review file. Restrict records to the task's own messages, not entire browser
snapshots. Do not include cookies, authentication headers or session storage.

Each review stores `decision` (`accepted`, `revise`, `needs_codex`), checks with
`pass`/`fail`/`not_run`, evidence, and concise feedback. Human-readable JSON is
sufficient. Successful UI transport and successful task validation are separate
facts and should be reported separately.

## State transitions

```text
prepared -> dispatching -> waiting -> collected -> reviewing -> accepted
                                                reviewing -> revise
revise -> prepared (round + 1, within the configured cap)
reviewing -> needs_codex (cap reached or unsuitable for delegation)

dispatching -> dispatch_unknown (uncertain submission; reconcile before retry)
waiting -> timed_out | completion_unknown | needs_user
any active state -> cancelled (when the user stops the task)
```

Interrupted tasks may resume from the recorded state only after inspecting the
matching conversation. `timed_out` and `dispatch_unknown` do not mean the prompt
was not sent or that Gemini stopped generating. Record remote cancellation only
when observed. None of these records automatically wake a finished Codex turn.
