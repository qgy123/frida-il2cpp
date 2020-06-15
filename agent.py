import frida
import sys

def on_message(message, data):
    if message['type'] == 'send':
        print(message['payload'])
    elif message['type'] == 'error':
        print(message['stack'])

pid = input("app pid: ")
try:
    session = frida.attach(int(pid))
    print("[+] Process Attached")
except Exception as e:
    print ("Error => {0}".format(e))
    sys.exit(0)

script = session.create_script(open('_agent.js', 'r').read())
script.on('message', on_message)
script.load()
print("[!] Ctrl+D on UNIX, Ctrl+Z on Windows/cmd.exe to detach from instrumented program.\n\n")
sys.stdin.read()
session.detach()