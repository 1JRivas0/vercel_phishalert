from app import app

# Vercel espera que la función se llame 'handler'
def handler(request):
    return app(request.environ, request.start_response)

# También exportamos app directamente
if __name__ == "__main__":
    app.run()