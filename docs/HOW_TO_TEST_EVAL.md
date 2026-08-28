# How to Test the Eval Workflow

## ✅ Test Workflow Created!

A new test workflow `test-eval.yml` has been created to help you verify if the eval system is working.

## 🚀 How to Run the Test

### Step 1: Go to GitHub Actions
1. Navigate to: https://github.com/daniel-yfc/stash/actions
2. You'll see a new workflow called **"Test Eval Workflow"**

### Step 2: Run the Workflow
1. Click on **"Test Eval Workflow"** from the left sidebar
2. Click the **"Run workflow"** button
3. (Optional) Change the scraper file to test (default: `ACCEED.yml`)
4. Click **"Run workflow"** again to start

### Step 3: View Results
1. Wait for the workflow to complete (~3-5 minutes)
2. Click on the workflow run to view detailed logs
3. Check each step:
   - ✅ Setup Deno
   - ✅ Setup Python
   - ✅ Install dependencies
   - ✅ Show workflow info
   - 🧪 Test eval-run.sh script
   - 🧪 Run Python tests
   - 🔍 Test validator
   - ✅ Summary

## 📊 What the Test Does

The test workflow will:

1. **Setup Environment**
   - Install Deno (for validator)
   - Install Python 3.11
   - Install pytest and pyyaml

2. **Show Directory Structure**
   - Display files in root, scripts/, and tests/

3. **Test eval-run.sh**
   - Execute the evaluation script
   - Continue even if it fails (to show errors)

4. **Run Python Tests**
   - Execute all tests in tests/ directory
   - Show detailed output with pytest -v

5. **Test Validator**
   - Run validator on the specified scraper file
   - Verify schema validation works

6. **Show Summary**
   - Display results of each test
   - Provide next steps based on results

## 🔍 Interpreting Results

### ✅ All Tests Pass
```
✅ Test workflow completed!

📊 Results:
- eval-run.sh: Tested (check logs above)
- Python tests: Tested (check logs above)
- Validator: Tested with ACCEED.yml

💡 Next steps:
1. Check the logs above for any errors
2. If all tests pass, eval.yml is working!
3. If tests fail, review the errors and fix them
```

**Meaning**: The eval system is working correctly!

### ⚠️ Some Tests Fail
```
⚠️ eval-run.sh failed or not implemented yet
⚠️ Some tests failed
```

**Meaning**: There are issues to fix:
- Check the error messages in the logs
- Fix the failing tests or scripts
- Re-run the test workflow

## 🛠️ Troubleshooting

### Issue: eval-run.sh Fails
**Possible causes**:
- Script not implemented yet
- Missing dependencies
- Path issues

**Solution**:
1. Check the error message in logs
2. Review `scripts/eval-run.sh` content
3. Fix the script or remove it if not needed

### Issue: Python Tests Fail
**Possible causes**:
- Missing test data
- Assertion errors
- Import errors

**Solution**:
1. Check pytest output in logs
2. Review test files in `tests/`
3. Fix the failing tests

### Issue: Validator Fails
**Possible causes**:
- Schema validation errors
- File not found
- Deno runtime issues

**Solution**:
1. Check validator error messages
2. Verify the scraper file exists
3. Ensure validator/index-zh-TW.mjs is correct

## 📝 Next Steps After Testing

### If Everything Works:
- ✅ Keep eval.yml as optional manual trigger
- ✅ Use it for scraper evaluation
- ✅ Consider adding to PR checks if useful

### If Issues Found:
- ⚠️ Fix the issues and re-test
- ⚠️ Or remove eval.yml if not needed (like we did with lint-rules.yml)

### If Not Useful:
- ❌ Remove eval.yml and related files
- ❌ Keep only quality-gate.yml and validate.yml

## 📚 Related Files

- `.github/workflows/test-eval.yml` - Test workflow (NEW!)
- `.github/workflows/eval.yml` - Original eval workflow
- `scripts/eval-run.sh` - Evaluation script
- `tests/` - Python test files
- `validator/index-zh-TW.mjs` - Schema validator

---

**Created**: 2026-08-28
**Purpose**: Verify eval system functionality before relying on it
