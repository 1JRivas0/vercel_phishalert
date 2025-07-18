import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from urllib.parse import urlparse # para el metodo info
import tldextract 
import logging

class PhishingDetector:
    def __init__(self, model_name='1Jacob22/PhishAlertAI-model'):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
        self.model.eval()
        logging.info(f"Modelo {model_name} cargado correctamente en {self.device}")
    
    def predict(self, url):
        """
        Analiza una URL para determinar si es phishing o legítima.
        
        Args:
            url (str): La URL a analizar
            
        Returns:
            dict: Diccionario con la predicción, confianza y detalles
        """
        try:
            # Preprocesar la URL
            inputs = self.tokenizer(url, return_tensors="pt", truncation=True, max_length=20)
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # Realizar la inferencia
            with torch.no_grad():
                outputs = self.model(**inputs)
            
            probabilities = outputs.logits.softmax(dim=1)
            prediction_idx = probabilities.argmax().item()
            prediction = 'Phishing' if prediction_idx == 0 else 'Legitimate'
            confidence = round(probabilities.max().item() * 100, 1)
            
            # Extraer características adicionales para el análisis detallado
            # En un modelo real, estas podrían ser características específicas del modelo
            # url_structure_score = round(probabilities[0][1].item() * 100, 1)
            
            return {
                'prediction': prediction,
                'confidence': confidence,
                # 'details': {
                #     'url_structure': url_structure_score,
                #     # 'keywords': 92.0  # Valor de ejemplo, en un modelo real sería calculado
                # }
            }
        except Exception as e:
            logging.error(f"Error en la predicción: {str(e)}")
            raise

    def info_url(self, url):
        # cantida de caracteres de una url
        urlCharCount = len(url)

        # Parsear la URL
        parsed = urlparse(url)
        
        # Protocolo (scheme)
        protocolo = parsed.scheme
        
        # # Dominio y subdominios (netloc)
        # dominio = parsed.netloc

        # Usar tldextract para extraer subdominio, dominio y sufijo
        ext = tldextract.extract(url)
        subdominio = ext.subdomain  # puede ser vacío si no hay subdominio
        dominio_principal = f"{ext.domain}.{ext.suffix}" if ext.suffix else ext.domain
        
        # Verificar si hay caracteres especiales en la URL
        caracteres_especiales = set(['$', '%', '#', '@', '!', '*', '+', '=', ':', '(', ')', '<', '>', ',', ';', '"', "'", '[', ']', '{', '}', '|', '\\', '^', '~', '`', ' '])
        contiene_especiales = any(c in url for c in caracteres_especiales)
        
        # Valor simulado
        url_structure = 44

        return {
            'urlLength' :  urlCharCount,
            'protocolo': protocolo,
            'subdominio': subdominio,
            'dominio_principal': dominio_principal,
            # 'dominio_o_subdominios': dominio,
            'contiene_caracteres_especiales': contiene_especiales,
            'url_structure' : url_structure
        }