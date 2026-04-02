# Predicción de Fuga de Clientes (Customer Churn) - Machine Learning End-to-End

Este proyecto demuestra un flujo de trabajo completo (End-to-End) de Machine Learning aplicado a un problema clásico de negocio: **Predecir el abandono o fuga de clientes en telecomunicaciones**.

## Características del Proyecto
* **Generación de Datos Sintéticos**: Simulación realista de un entorno de telecomunicaciones.
* **Preprocesamiento Completo**: Uso de `ColumnTransformer` y `Pipeline` de Scikit-Learn para estandarizar variables numéricas y codificar variables categóricas de forma segura evitando data-leakage.
* **Modelado Avanzado**: Implementación de `RandomForestClassifier` lidiando con el desbalanceo de clases (`class_weight='balanced'`).
* **Optimización de Hiperparámetros**: Búsqueda metódica con `GridSearchCV` y validación cruzada estratificada (`StratifiedKFold`).
* **Métricas de Evaluación orientadas a Negocio**: Matriz de confusión, ROC-AUC, Precision, Recall y F1-Score.

## Ejecución
Para visualizar el flujo completo y los resultados del mejor modelo iterativo:

```bash
python train_evaluate_model.py
```
