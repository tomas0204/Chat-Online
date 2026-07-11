from django.core.management.base import BaseCommand
import subprocess

class Command(BaseCommand):
    help = "Run Daphne server with autoreload"

    def add_arguments(self, parser):
        parser.add_argument("addrport", nargs="?", default="127.0.0.1:8000")

    def handle(self, *args, **options):
        addrport = options["addrport"]

        if ":" in addrport:
            addr, port = addrport.split(":")
        else:
            addr, port = "127.0.0.1", addrport

        # 👉 Mostrar info como runserver
        self.stdout.write(self.style.SUCCESS(
            f"Starting Daphne at http://{addr}:{port}/"
        ))

        self.stdout.write("Quit the server with CTRL-BREAK.\n")

        cmd = f"daphne -b {addr} -p {port} ChatOnlineP.asgi:application"

        try:
            subprocess.run([
                "watchfiles",
                cmd
            ])
        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING("Servidor detenido"))