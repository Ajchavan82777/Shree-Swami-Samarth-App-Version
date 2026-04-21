"""
Parses pytest -v text output + Node.js test output and writes a
structured log file to tests/logs/.

Usage:
    python tests/parse_results.py <backend.tmp> <frontend.tmp> <log.txt> <date> <time>
"""
import sys
import os
import re


# ─── pytest text output parser ────────────────────────────────────────────────

def parse_pytest_text(output_file):
    """
    Parse pytest -v --tb=short text output.
    Returns a list of dicts: {name, module, status, message, detail}
    """
    if not os.path.exists(output_file):
        return []

    with open(output_file, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    lines = content.splitlines()
    results_map = {}   # test_name -> result dict (preserves last write)
    order        = []  # ordered list of names

    # ── Pass 1: individual test result lines ──────────────────────
    # Format (pytest -v):
    #   tests/backend/test_health.py::test_health_returns_200 PASSED   [  1%]
    #   tests/backend/test_auth.py::test_bad_login FAILED              [ 10%]
    for line in lines:
        # Must have "::" (test path separator) and "[" (progress %)
        if '::' not in line or '[' not in line:
            continue

        line_s = line.strip()

        if ' PASSED ' in line_s or line_s.endswith(' PASSED'):
            raw_path  = re.split(r'\s+PASSED', line_s)[0].strip()
            test_name = raw_path.split('::')[-1]
            module    = raw_path.split('::')[0].replace('tests/backend/', '').replace('tests\\backend\\', '')
            if test_name not in results_map:
                order.append(test_name)
            results_map[test_name] = {
                'name':    test_name,
                'module':  module,
                'status':  'PASSED',
                'message': '',
                'detail':  '',
            }

        elif ' FAILED ' in line_s or line_s.endswith(' FAILED'):
            raw_path  = re.split(r'\s+FAILED', line_s)[0].strip()
            test_name = raw_path.split('::')[-1]
            module    = raw_path.split('::')[0].replace('tests/backend/', '').replace('tests\\backend\\', '')
            if test_name not in results_map:
                order.append(test_name)
            results_map[test_name] = {
                'name':    test_name,
                'module':  module,
                'status':  'FAILED',
                'message': '',
                'detail':  '',
            }

    # ── Pass 2: short error summary lines ─────────────────────────
    # Format (pytest short test summary info section):
    #   FAILED tests/backend/test_auth.py::test_name - AssertionError: assert 422 == 401
    for line in lines:
        line_s = line.strip()
        if line_s.startswith('FAILED ') and '::' in line_s and ' - ' in line_s:
            # Extract test name and message
            after_failed = line_s[7:].strip()          # remove "FAILED "
            path_part, _, msg_part = after_failed.partition(' - ')
            test_name = path_part.strip().split('::')[-1]
            if test_name in results_map:
                results_map[test_name]['message'] = msg_part.strip()

    # ── Pass 3: multi-line error details ──────────────────────────
    # Delimited by:  "_______ test_name _______"  ...  next "___" or "==="
    in_block     = False
    current_name = None
    block_lines  = []

    for line in lines:
        # Section separator like "___ test_name ___" or "___ test_name[param] ___"
        m = re.match(r'^_{5,}\s+(.+?)\s+_{5,}$', line)
        if m:
            # Save previous block
            if current_name and block_lines and current_name in results_map:
                results_map[current_name]['detail'] = '\n'.join(block_lines).strip()
            # Start new block
            test_name = m.group(1).strip()
            # Sometimes pytest adds brackets: "test_name[param]"
            base_name = test_name.split('[')[0]
            if base_name in results_map:
                current_name = base_name
                block_lines  = []
                in_block     = True
            else:
                in_block     = False
                current_name = None
        elif line.startswith('=') and in_block:
            # End of FAILURES section
            if current_name and block_lines and current_name in results_map:
                results_map[current_name]['detail'] = '\n'.join(block_lines).strip()
            in_block     = False
            current_name = None
            block_lines  = []
        elif in_block:
            block_lines.append(line.rstrip())

    # Save last block
    if current_name and block_lines and current_name in results_map:
        results_map[current_name]['detail'] = '\n'.join(block_lines).strip()

    return [results_map[n] for n in order if n in results_map]


# ─── Frontend (Node.js) output parser ────────────────────────────────────────

def parse_frontend_output(fe_file):
    """
    Parse test_utils.js output.
    PASS  / FAIL  lines followed by optional "        -> error" line.
    """
    results = []
    if not os.path.exists(fe_file):
        return results

    with open(fe_file, 'r', encoding='utf-8', errors='replace') as f:
        lines = f.readlines()

    last_fail = None
    for line in lines:
        s = line.rstrip('\n')
        if s.startswith('  PASS  '):
            results.append({'name': s[8:].strip(), 'status': 'PASSED',
                            'message': '', 'detail': ''})
            last_fail = None
        elif s.startswith('  FAIL  '):
            entry = {'name': s[8:].strip(), 'status': 'FAILED',
                     'message': 'Assertion failed', 'detail': ''}
            results.append(entry)
            last_fail = entry
        elif s.startswith('        -> ') and last_fail:
            last_fail['message'] = s.replace('        -> ', '').strip()
            last_fail = None

    return results


# ─── Log writer ───────────────────────────────────────────────────────────────

def _clip(s, n=120):
    s = ' '.join(str(s).split())          # collapse whitespace
    return s[:n] + '...' if len(s) > n else s


def write_log(log_file, backend, frontend, date_str, time_str):
    SEP  = '=' * 70
    DASH = '-' * 70

    be_pass  = sum(1 for r in backend  if r['status'] == 'PASSED')
    be_fail  = sum(1 for r in backend  if r['status'] == 'FAILED')
    fe_pass  = sum(1 for r in frontend if r['status'] == 'PASSED')
    fe_fail  = sum(1 for r in frontend if r['status'] == 'FAILED')
    tot_pass = be_pass + fe_pass
    tot_fail = be_fail + fe_fail
    overall  = 'ALL PASSED' if tot_fail == 0 else '*** FAILURES FOUND – REVIEW BELOW ***'

    counter = 1

    with open(log_file, 'w', encoding='utf-8') as f:

        # ── File header ───────────────────────────────────────────
        f.write(SEP + '\n')
        f.write('  SHREE SWAMI SAMARTH CATERING APP\n')
        f.write('  AUTOMATED TEST RUN LOG\n')
        f.write(f'  Date    : {date_str}\n')
        f.write(f'  Time    : {time_str}\n')
        f.write(SEP + '\n\n')

        # ── Backend ───────────────────────────────────────────────
        f.write(SEP + '\n')
        f.write('  SECTION 1 : BACKEND API TESTS  (pytest)\n')
        f.write(f'  Result   : {be_pass} passed,  {be_fail} failed\n')
        f.write(SEP + '\n\n')

        if not backend:
            f.write('  [!] No backend test results captured.\n')
            f.write('      Possible causes:\n')
            f.write('       - pytest could not collect tests (ImportError)\n')
            f.write('       - virtual environment not activated\n')
            f.write('       - dependencies not installed\n\n')
        else:
            for r in backend:
                if r['status'] == 'PASSED':
                    issue        = 'None'
                    need_resolve = 'No'
                else:
                    issue        = _clip(r['message']) if r['message'] else 'Test assertion / runtime error'
                    need_resolve = ('Yes – ' + _clip(r['message'], 80)) if r['message'] else 'Yes – fix failing assertion'

                f.write(f'{counter}) Test Case ID          - [TC_{counter:03d}]\n')
                f.write(f'   Test Case             - [{r["name"]}]\n')
                f.write(f'   Status                - [{r["status"]}]\n')
                f.write(f'   Test Case Issue Found - [{issue}]\n')
                f.write(f'   Need to Resolve       - [{need_resolve}]\n')

                if r['status'] == 'FAILED' and r.get('detail'):
                    detail_lines = r['detail'].strip().splitlines()
                    f.write('   Error Detail          :\n')
                    for dl in detail_lines[:12]:
                        f.write(f'     {dl}\n')
                    if len(detail_lines) > 12:
                        f.write(f'     ... (+{len(detail_lines)-12} more lines)\n')

                f.write('\n')
                counter += 1

        f.write(DASH + '\n')
        f.write(f'  Backend Summary  :  {be_pass} passed,  {be_fail} failed\n\n')

        # ── Frontend ──────────────────────────────────────────────
        f.write(SEP + '\n')
        f.write('  SECTION 2 : FRONTEND UTILITY TESTS  (Node.js)\n')

        if not frontend:
            f.write('  Result   : SKIPPED  (Node.js not installed or produced no output)\n')
            f.write(SEP + '\n\n')
            f.write('  [!] No frontend test results captured.\n\n')
        else:
            f.write(f'  Result   : {fe_pass} passed,  {fe_fail} failed\n')
            f.write(SEP + '\n\n')

            for r in frontend:
                if r['status'] == 'PASSED':
                    issue        = 'None'
                    need_resolve = 'No'
                else:
                    issue        = _clip(r['message']) if r['message'] else 'Assertion failed'
                    need_resolve = ('Yes – ' + _clip(r['message'], 80)) if r['message'] else 'Yes – fix assertion'

                f.write(f'{counter}) Test Case ID          - [TC_{counter:03d}]\n')
                f.write(f'   Test Case             - [{r["name"]}]\n')
                f.write(f'   Status                - [{r["status"]}]\n')
                f.write(f'   Test Case Issue Found - [{issue}]\n')
                f.write(f'   Need to Resolve       - [{need_resolve}]\n\n')
                counter += 1

            f.write(DASH + '\n')
            f.write(f'  Frontend Summary :  {fe_pass} passed,  {fe_fail} failed\n\n')

        # ── Final summary ─────────────────────────────────────────
        f.write(SEP + '\n')
        f.write('  FINAL SUMMARY\n')
        f.write(SEP + '\n')
        f.write(f'  Backend  Tests  :  {be_pass} passed,  {be_fail} failed\n')
        if frontend:
            f.write(f'  Frontend Tests  :  {fe_pass} passed,  {fe_fail} failed\n')
        else:
            f.write('  Frontend Tests  :  SKIPPED\n')
        f.write(f'  {"–"*46}\n')
        f.write(f'  Total           :  {tot_pass} passed,  {tot_fail} failed\n')
        f.write(f'  Overall Status  :  {overall}\n')
        f.write(SEP + '\n')

    return tot_pass, tot_fail


# ─── Entry point ──────────────────────────────────────────────────────────────

if __name__ == '__main__':
    if len(sys.argv) < 6:
        print('Usage: parse_results.py <backend.tmp> <frontend.tmp> <log.txt> <date> <time>')
        sys.exit(1)

    be_file   = sys.argv[1]
    fe_file   = sys.argv[2]
    log_file  = sys.argv[3]
    date_str  = sys.argv[4]
    time_str  = sys.argv[5]

    os.makedirs(os.path.dirname(log_file), exist_ok=True)

    backend  = parse_pytest_text(be_file)
    frontend = parse_frontend_output(fe_file)

    tot_pass, tot_fail = write_log(log_file, backend, frontend, date_str, time_str)

    total = len(backend) + len(frontend)
    print(f'  Parsed  : {total} test cases  ({tot_pass} passed, {tot_fail} failed)')
    print(f'  Log     : {log_file}')
