
# FarmWise — Test Cases

These cases describe expected application behavior. Verify them against the actual implementation before treating them as passed tests.

| ID | Test Scenario | Input / Condition | Expected Result |
|---|---|---|---|
| TC01 | Valid farmer profile | Complete farm details | Application processes the profile successfully |
| TC02 | Missing required input | Crop or location missing | Show validation message or request missing information |
| TC03 | Budget feasibility | Budget below estimated crop costs | Flag the plan as potentially infeasible |
| TC04 | Water availability | Limited water supply | Consider water availability when evaluating suitable options |
| TC05 | Weather API failure | Weather service unavailable | Show an error or fallback message gracefully |
| TC06 | AI service failure | Gemini API unavailable | Display an appropriate error without crashing the application |
| TC07 | Invalid input | Negative farm size or budget | Reject or flag invalid values |
| TC08 | Language selection | Select a supported language | Display supported translations where implemented |
| TC09 | Crop advisory | Provide valid farm details | Display an advisory based on available inputs |
| TC10 | Missing API key | Required key is not configured | Explain the configuration problem safely |

## Running Tests

Follow the test commands documented in the root README.md.

## Test Status

These are planned test cases. Mark a case as passed only after executing it and verifying the result.
