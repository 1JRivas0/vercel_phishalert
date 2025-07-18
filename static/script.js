document.addEventListener('DOMContentLoaded', function() {
    const analyzeBtn = document.getElementById('analyze-btn');
    const urlInput = document.getElementById('url-input');

    // Función para mostrar alertas de error
    function showErrorAlert(message) {
        document.getElementById('loading').classList.add('hidden');
        alert(`Error: ${message}`);
    }

    // Función para actualizar una barra de progreso
    function updateProgressBar(elementId, percentage) {
        const bar = document.getElementById(elementId);
        if (bar) {
            bar.style.width = `${percentage}%`;
        }
    }

    // Función para actualizar el color de la predicción
    function updatePredictionStyle(prediction) {
        const predictionText = document.getElementById('prediction-text');
        
        // Actualizar el icono de predicción
        const predictionCard = document.querySelector('.bg-green-100');
        const predictionIcon = predictionCard ? predictionCard.querySelector('i') : null;
        
        if (prediction === 'Phishing') {
            // Actualizar texto
            predictionText.classList.remove('text-green-600');
            predictionText.classList.add('text-red-600');
            
            // Actualizar icono y fondo
            if (predictionIcon) {
                predictionIcon.classList.remove('fa-check-circle', 'text-green-600');
                predictionIcon.classList.add('fa-exclamation-triangle', 'text-red-600');
                
                // Cambiar el fondo del icono
                predictionCard.classList.remove('bg-green-100');
                predictionCard.classList.add('bg-red-100');
            }
        } else {
            // Actualizar texto
            predictionText.classList.remove('text-red-600');
            predictionText.classList.add('text-green-600');
            
            // Actualizar icono y fondo
            if (predictionIcon) {
                predictionIcon.classList.remove('fa-exclamation-triangle', 'text-red-600');
                predictionIcon.classList.add('fa-check-circle', 'text-green-600');
                
                // Cambiar el fondo del icono
                predictionCard.classList.remove('bg-red-100');
                predictionCard.classList.add('bg-green-100');
            }
        }
    }

    // Función para actualizar la recomendación
    function updateRecommendation(prediction) {
        const recommendationAction = document.getElementById('recommendation-action');
        const recommendationDiv = document.getElementById('recommendation');
        
        if (recommendationAction && recommendationDiv) {
            if (prediction === 'Phishing') {
                recommendationAction.textContent = 'evitar esta URL';
                recommendationAction.classList.remove('text-green-600');
                recommendationAction.classList.add('text-red-600');
                
                // Cambiar el estilo del div de recomendación
                recommendationDiv.classList.remove('bg-blue-50', 'border-blue-500');
                recommendationDiv.classList.add('bg-red-50', 'border-red-500');
            } else {
                recommendationAction.textContent = 'proceder con seguridad';
                recommendationAction.classList.remove('text-red-600');
                recommendationAction.classList.add('text-green-600');
                
                // Cambiar el estilo del div de recomendación
                recommendationDiv.classList.remove('bg-red-50', 'border-red-500');
                recommendationDiv.classList.add('bg-green-50', 'border-green-500');
            }
        }
    }

    // Función para actualizar los detalles
    function updateDetails(details) {
        // Actualizar detalles básicos
        if (details) {
            // Actualizar keywords en la tarjeta de detalles
            const keywordsDetail = document.getElementById('domain-principal');
            if (keywordsDetail) {
                keywordsDetail.textContent = `${details.dominio_principal}`;
            }
            
            // Actualizar otros detalles si están disponibles
            const domainAge = document.getElementById('domain-age');

            const sslCert = document.getElementById('ssl-cert');
            
            if (domainAge) domainAge.textContent = 'N/A';
            if (sslCert) sslCert.textContent = 'N/A';
        }
    }

    // Función para actualizar todas las barras de progreso
    function updateAllProgressBars(details) {
        if (!details) return;
        
        // Actualizar la barra de estructura de URL
        const urlStructureText = document.getElementById('url-structure');
        // Usar un valor predeterminado si details.url_structure no existe
        const urlStructureValue = details.url_structure || 44;
        
        if (urlStructureText) urlStructureText.textContent = `${urlStructureValue}%`;
        updateProgressBar('url-structure-bar', urlStructureValue);
        
        // Actualizar otras barras con valores predeterminados o simulados
        const defaultBars = [
            { id: 'domain-reputation', textId: 'domain-reputation', value: 85 },
            { id: 'content-analysis', textId: 'content-analysis', value: 70 },
            { id: 'behavioral-patterns', textId: 'behavioral-patterns', value: 60 }
        ];
        
        defaultBars.forEach(bar => {
            const textElement = document.getElementById(bar.textId);
            if (textElement) textElement.textContent = `${bar.value}%`;
            updateProgressBar(`${bar.id}-bar`, bar.value);
        });
    }

    // Función para agregar entrada al historial
    // function addToHistory(url, prediction, confidence) {
    //     const historyTable = document.getElementById('history-table');
    //     if (!historyTable) return;
        
    //     const now = new Date();
    //     const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
        
    //     const row = document.createElement('tr');
        
    //     // URL column
    //     const urlCell = document.createElement('td');
    //     urlCell.className = 'px-6 py-4 whitespace-nowrap';
    //     urlCell.innerHTML = `<div class="text-sm text-gray-900 truncate max-w-xs">${url}</div>`;
        
    //     // Status column
    //     const statusCell = document.createElement('td');
    //     statusCell.className = 'px-6 py-4 whitespace-nowrap';
    //     const statusColor = prediction === 'Phishing' ? 'text-red-600' : 'text-green-600';
    //     statusCell.innerHTML = `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${prediction === 'Phishing' ? 'red' : 'green'}-100 ${statusColor}">${prediction}</span>`;
        
    //     // Date column
    //     const dateCell = document.createElement('td');
    //     dateCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
    //     dateCell.textContent = dateStr;
        
    //     // Confidence column
    //     const confidenceCell = document.createElement('td');
    //     confidenceCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
    //     confidenceCell.textContent = `${confidence}%`;
        
    //     // Add cells to row
    //     row.appendChild(urlCell);
    //     row.appendChild(statusCell);
    //     row.appendChild(dateCell);
    //     row.appendChild(confidenceCell);
        
    //     // Add row to table (at the beginning)
    //     if (historyTable.firstChild) {
    //         historyTable.insertBefore(row, historyTable.firstChild);
    //     } else {
    //         historyTable.appendChild(row);
    //     }
    // }

    analyzeBtn.addEventListener('click', async function() {
        const url = urlInput.value.trim();
        
        if (!url) {
            alert('Por favor ingresa una URL válida');
            return;
        }

        try {
            // Mostrar indicador de carga
            document.getElementById('loading').classList.remove('hidden');
            document.getElementById('results').classList.add('hidden');

            const [res1, res2] = await Promise.all([
                fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url })
                }),

                fetch('/info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url })
                })
            ]);

            // Manejo de errores en el frontend
            const data = await res1.json();     // data es el resultado de la prediccion
            const data2 = await res2.json();    // data2 es el resultado de la info_url
            
            if (data.error || data2.error) {
                showErrorAlert(data.message);
                return;
            }

            // Actualizar la UI con los resultados básicos
            document.getElementById('submitted-url').textContent = url;
            document.getElementById('prediction-text').textContent = data.prediction;
            document.getElementById('prediction-confidence').textContent = `(${data.confidence}%)`;
            
            // Actualizar el estilo según la predicción
            updatePredictionStyle(data.prediction);
            
            // Actualizar los detalles
            updateDetails(data2);
            
            // Actualizar todas las barras de progreso
            updateAllProgressBars(data2);
            
            // Actualizar la recomendación
            updateRecommendation(data.prediction);
            
            // Agregar al historial
            // addToHistory(url, data.prediction, data.confidence);
            
            // Mostrar los resultados
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('results').classList.remove('hidden');

        } catch (error) {
            console.error('Error:', error);
            showErrorAlert('Error al analizar la URL');
        }
    });
});