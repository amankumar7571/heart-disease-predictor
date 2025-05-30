// Heart Disease Prediction Application JavaScript

class HeartDiseasePrediction {
    constructor() {
        this.form = document.getElementById('predictionForm');
        this.resultsCard = document.getElementById('resultsCard');
        this.predictBtn = document.querySelector('.predict-btn');
        
        this.initializeEventListeners();
        this.updateSliderValues();
    }
    
    initializeEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePrediction();
        });
        
        // Slider value updates
        const sliders = document.querySelectorAll('.slider');
        sliders.forEach(slider => {
            slider.addEventListener('input', () => {
                this.updateSliderValues();
            });
        });
    }
    
    updateSliderValues() {
        // Update age display
        const ageSlider = document.getElementById('age');
        const ageValue = document.getElementById('ageValue');
        if (ageSlider && ageValue) {
            ageValue.textContent = ageSlider.value;
        }
        
        // Update blood pressure display
        const bpSlider = document.getElementById('trestbps');
        const bpValue = document.getElementById('trestbpsValue');
        if (bpSlider && bpValue) {
            bpValue.textContent = bpSlider.value;
        }
        
        // Update cholesterol display
        const cholSlider = document.getElementById('chol');
        const cholValue = document.getElementById('cholValue');
        if (cholSlider && cholValue) {
            cholValue.textContent = cholSlider.value;
        }
        
        // Update heart rate display
        const hrSlider = document.getElementById('thalach');
        const hrValue = document.getElementById('thalachValue');
        if (hrSlider && hrValue) {
            hrValue.textContent = hrSlider.value;
        }
        
        // Update ST depression display
        const stSlider = document.getElementById('oldpeak');
        const stValue = document.getElementById('oldpeakValue');
        if (stSlider && stValue) {
            stValue.textContent = parseFloat(stSlider.value).toFixed(1);
        }
    }
    
    handlePrediction() {
        console.log('Starting prediction...');
        
        // Show loading state
        this.predictBtn.disabled = true;
        this.predictBtn.classList.add('loading');
        const originalText = this.predictBtn.textContent;
        this.predictBtn.textContent = 'Analyzing...';
        
        // Use setTimeout to simulate processing and ensure UI updates
        setTimeout(() => {
            console.log('Processing prediction...');
            
            try {
                // Get form data
                const formData = this.getFormData();
                console.log('Form data:', formData);
                
                // Make prediction
                const prediction = this.predictHeartDisease(formData);
                console.log('Prediction result:', prediction);
                
                // Display results
                this.displayResults(prediction);
                
                // Show results card
                this.resultsCard.style.display = 'block';
                this.resultsCard.scrollIntoView({ behavior: 'smooth' });
                
                console.log('Prediction completed successfully');
                
            } catch (error) {
                console.error('Prediction error:', error);
                this.showError('An error occurred during prediction. Please try again.');
            }
            
            // Always reset button state
            this.predictBtn.disabled = false;
            this.predictBtn.classList.remove('loading');
            this.predictBtn.textContent = originalText;
            
        }, 1500);
    }
    
    getFormData() {
        const sexRadio = document.querySelector('input[name="sex"]:checked');
        const fbsRadio = document.querySelector('input[name="fbs"]:checked');
        const exangRadio = document.querySelector('input[name="exang"]:checked');
        
        return {
            age: parseInt(document.getElementById('age').value) || 50,
            sex: sexRadio ? parseInt(sexRadio.value) : 1,
            cp: parseInt(document.getElementById('cp').value) || 0,
            trestbps: parseInt(document.getElementById('trestbps').value) || 120,
            chol: parseInt(document.getElementById('chol').value) || 250,
            fbs: fbsRadio ? parseInt(fbsRadio.value) : 0,
            restecg: parseInt(document.getElementById('restecg').value) || 0,
            thalach: parseInt(document.getElementById('thalach').value) || 150,
            exang: exangRadio ? parseInt(exangRadio.value) : 0,
            oldpeak: parseFloat(document.getElementById('oldpeak').value) || 1.0,
            slope: parseInt(document.getElementById('slope').value) || 0,
            ca: parseInt(document.getElementById('ca').value) || 0,
            thal: parseInt(document.getElementById('thal').value) || 1
        };
    }
    
    predictHeartDisease(data) {
        // Simplified prediction algorithm
        let riskScore = 0;
        
        // Age factor (0-1 scale)
        riskScore += (data.age - 25) / 55 * 0.15;
        
        // Male gender increases risk
        if (data.sex === 1) riskScore += 0.1;
        
        // Chest pain type - asymptomatic is highest risk
        if (data.cp === 3) riskScore += 0.2;
        else if (data.cp === 0) riskScore += 0.15;
        else if (data.cp === 1) riskScore += 0.1;
        
        // High blood pressure
        if (data.trestbps > 140) riskScore += 0.15;
        else if (data.trestbps > 120) riskScore += 0.05;
        
        // High cholesterol
        if (data.chol > 240) riskScore += 0.1;
        else if (data.chol > 200) riskScore += 0.05;
        
        // Fasting blood sugar
        if (data.fbs === 1) riskScore += 0.05;
        
        // Abnormal ECG
        if (data.restecg === 2) riskScore += 0.1;
        else if (data.restecg === 1) riskScore += 0.05;
        
        // Low max heart rate for age
        const expectedHR = 220 - data.age;
        if (data.thalach < expectedHR * 0.7) riskScore += 0.15;
        else if (data.thalach < expectedHR * 0.85) riskScore += 0.05;
        
        // Exercise induced angina
        if (data.exang === 1) riskScore += 0.1;
        
        // ST depression
        if (data.oldpeak > 2) riskScore += 0.15;
        else if (data.oldpeak > 1) riskScore += 0.05;
        
        // ST slope
        if (data.slope === 2) riskScore += 0.1; // Downsloping
        else if (data.slope === 1) riskScore += 0.05; // Flat
        
        // Major vessels
        riskScore += data.ca * 0.05;
        
        // Thalassemia
        if (data.thal === 3) riskScore += 0.15; // Reversible defect
        else if (data.thal === 2) riskScore += 0.1; // Fixed defect
        
        // Ensure score is between 0 and 1
        riskScore = Math.max(0, Math.min(1, riskScore));
        
        // Add some randomness for variability
        riskScore += (Math.random() - 0.5) * 0.1;
        riskScore = Math.max(0, Math.min(1, riskScore));
        
        // Determine prediction (threshold at 0.5)
        const hasDisease = riskScore > 0.5;
        
        // Calculate confidence
        const distanceFromThreshold = Math.abs(riskScore - 0.5);
        const confidence = Math.min(0.95, 0.6 + distanceFromThreshold * 1.5);
        
        return {
            prediction: hasDisease ? 1 : 0,
            confidence: confidence,
            riskScore: riskScore,
            factors: this.getRiskFactors(data)
        };
    }
    
    getRiskFactors(data) {
        const factors = [];
        
        if (data.age > 60) factors.push("Advanced age (>60 years)");
        if (data.sex === 1) factors.push("Male gender");
        if (data.cp === 3) factors.push("Asymptomatic chest pain");
        if (data.trestbps > 140) factors.push("High blood pressure (>140 mmHg)");
        if (data.chol > 240) factors.push("High cholesterol (>240 mg/dl)");
        if (data.fbs === 1) factors.push("Elevated fasting blood sugar");
        if (data.thalach < 100) factors.push("Low maximum heart rate");
        if (data.exang === 1) factors.push("Exercise-induced angina");
        if (data.oldpeak > 2) factors.push("Significant ST depression");
        if (data.ca > 0) factors.push("Major vessel involvement");
        if (data.thal === 3) factors.push("Reversible thalassemia defect");
        
        return factors;
    }
    
    displayResults(prediction) {
        const resultDiv = document.getElementById('predictionResult');
        const confidenceDiv = document.getElementById('confidenceScore');
        const interpretationDiv = document.getElementById('riskInterpretation');
        
        // Display main result
        if (prediction.prediction === 1) {
            resultDiv.className = 'prediction-result high-risk';
            resultDiv.textContent = '⚠️ HIGH RISK';
        } else {
            resultDiv.className = 'prediction-result low-risk';
            resultDiv.textContent = '✅ LOW RISK';
        }
        
        // Display confidence
        const confidencePercent = Math.round(prediction.confidence * 100);
        confidenceDiv.textContent = `Confidence: ${confidencePercent}%`;
        
        // Display interpretation
        let interpretation = '';
        if (prediction.prediction === 1) {
            interpretation = `
                <strong>High Risk Assessment:</strong><br>
                The analysis indicates an elevated risk of heart disease. This assessment is based on multiple risk factors 
                in your clinical profile. We strongly recommend consulting with a cardiologist for comprehensive evaluation 
                and appropriate medical intervention.
            `;
            if (prediction.factors.length > 0) {
                interpretation += `<br><br><strong>Key Risk Factors Identified:</strong><br>• ${prediction.factors.join('<br>• ')}`;
            }
        } else {
            interpretation = `
                <strong>Low Risk Assessment:</strong><br>
                The analysis suggests a lower probability of heart disease based on your current clinical parameters. 
                However, maintain regular health checkups and continue following heart-healthy lifestyle practices.
            `;
            if (prediction.factors.length > 0) {
                interpretation += `<br><br><strong>Areas for Monitoring:</strong><br>• ${prediction.factors.join('<br>• ')}`;
            }
        }
        
        interpretationDiv.innerHTML = interpretation;
    }
    
    showError(message) {
        const resultDiv = document.getElementById('predictionResult');
        const confidenceDiv = document.getElementById('confidenceScore');
        const interpretationDiv = document.getElementById('riskInterpretation');
        
        resultDiv.className = 'prediction-result';
        resultDiv.style.background = 'rgba(var(--color-error-rgb), 0.15)';
        resultDiv.style.color = 'var(--color-error)';
        resultDiv.textContent = '❌ Error';
        
        confidenceDiv.textContent = '';
        interpretationDiv.innerHTML = `<strong>Error:</strong> ${message}`;
        
        this.resultsCard.style.display = 'block';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Heart Disease Prediction App...');
    new HeartDiseasePrediction();
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('slider')) {
        e.target.blur();
    }
});

// Add touch support for mobile devices
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}