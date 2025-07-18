from flask import Flask, render_template, jsonify, request
import logging
import os

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Importar el detector de phishing
from model.model import PhishingDetector

app = Flask(__name__, static_folder='static')

# Inicializar el detector de phishing (se carga una sola vez al iniciar la aplicación)
detector = None
try:
    detector = PhishingDetector()  # Usar el valor por defecto '1Jacob22/PhishAlertAI-model'
    logging.info("Detector de phishing inicializado correctamente")
except Exception as e:
    logging.error(f"Error al inicializar el detector: {str(e)}")
    # Imprimir más detalles para depuración
    import traceback
    logging.error(traceback.format_exc())

@app.route('/')
def index():
    return render_template('index.html')

# Endpoint para obtener info
@app.route('/info', methods=['POST'])
def info():
    data = request.get_json()
    url = data.get('url')
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    info = detector.info_url(url)
    return jsonify(info)    

# Endpint para predecir
@app.route('/predict', methods=['POST'])
def predict():
    # Verificar si el detector se inicializó correctamente
    if detector is None:
        return jsonify({
            'error': 'Error en el servidor', 
            'message': 'El modelo no se ha inicializado correctamente'
        }), 500
    
    # Manejo de errores mejorado
    try:
        # Obtener la URL del request
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({
                'error': 'Error en la solicitud', 
                'message': 'No se proporcionó una URL válida'
            }), 400
        
        # Realizar la predicción usando el detector
        result = detector.predict(url)
        
        # Devolver el resultado
        return jsonify(result)
    
    except Exception as e:
        logging.error(f"Error en la predicción: {str(e)}")
        return jsonify({
            'error': 'Error en el análisis', 
            'message': str(e)
        }), 500

# Para Vercel, necesitamos exportar la app
if __name__ == '__main__':
    app.run(debug=True)
else:
    # Para producción en Vercel
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
