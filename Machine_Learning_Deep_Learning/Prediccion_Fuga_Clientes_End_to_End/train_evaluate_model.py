import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns
import logging

# Configuración de Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def generar_datos_sinteticos(n_samples=5000):
    """
    Genera un dataset sintético de Telecomunicaciones para predecir la fuga (Churn) de clientes.
    """
    logging.info("Generando datos sintéticos para el entrenamiento...")
    np.random.seed(42)
    data = {
        'Antiguedad_Meses': np.random.randint(1, 72, n_samples),
        'Cargo_Mensual': np.random.uniform(20.0, 120.0, n_samples),
        'Cargo_Total': np.zeros(n_samples), # Se calcula abajo
        'Contrato': np.random.choice(['Mes a mes', 'Un año', 'Dos años'], n_samples, p=[0.5, 0.3, 0.2]),
        'Soporte_Tecnico': np.random.choice(['Si', 'No'], n_samples, p=[0.3, 0.7]),
        'Metodo_Pago': np.random.choice(['Tarjeta_Credito', 'Cheque_Elec', 'Transferencia'], n_samples),
        'Fuga': np.random.choice([0, 1], n_samples, p=[0.73, 0.27]) # 27% baseline churn
    }
    df = pd.DataFrame(data)
    
    # Simular una relación más realista para la correlación
    df['Cargo_Total'] = df['Antiguedad_Meses'] * df['Cargo_Mensual'] * np.random.uniform(0.9, 1.1, n_samples)
    
    # Aumentar probabilidad de fuga si contrato es mes a mes y no hay soporte técnico
    df.loc[(df['Contrato'] == 'Mes a mes') & (df['Soporte_Tecnico'] == 'No'), 'Fuga'] = \
        np.where(np.random.rand(sum((df['Contrato'] == 'Mes a mes') & (df['Soporte_Tecnico'] == 'No'))) > 0.4, 1, 0)
        
    logging.info(f"Dataset generado con forma: {df.shape}")
    return df

def construir_pipeline_y_entrenar(df):
    """
    Construye un pipeline de procesamiento y modelado, y lo entrena.
    """
    logging.info("Preprocesando datos y configurando Pipeline...")
    X = df.drop('Fuga', axis=1)
    y = df['Fuga']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Definir variables categóricas y numéricas
    num_features = ['Antiguedad_Meses', 'Cargo_Mensual', 'Cargo_Total']
    cat_features = ['Contrato', 'Soporte_Tecnico', 'Metodo_Pago']
    
    # Transformadores
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), cat_features)
        ])
    
    # Pipeline Completo
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(random_state=42, class_weight='balanced'))
    ])
    
    # Búsqueda de hiperparámetros (Grid Search)
    param_grid = {
        'classifier__n_estimators': [100, 200],
        'classifier__max_depth': [5, 10, None],
        'classifier__min_samples_split': [2, 5]
    }
    
    logging.info("Iniciando búsqueda de hiperparámetros (GridSearchCV)...")
    cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)
    grid_search = GridSearchCV(pipeline, param_grid, cv=cv, scoring='roc_auc', n_jobs=-1, verbose=1)
    
    grid_search.fit(X_train, y_train)
    logging.info(f"Mejores Parámetros: {grid_search.best_params_}")
    
    # Evaluación
    y_pred = grid_search.predict(X_test)
    y_proba = grid_search.predict_proba(X_test)[:, 1]
    
    evaluar_modelo(y_test, y_pred, y_proba)
    
    return grid_search.best_estimator_

def evaluar_modelo(y_true, y_pred, y_proba):
    logging.info("=== Evaluación del Modelo ===")
    print("\nMatriz de Confusión:")
    print(confusion_matrix(y_true, y_pred))
    
    print("\nReporte de Clasificación:")
    print(classification_report(y_true, y_pred))
    
    roc_auc = roc_auc_score(y_true, y_proba)
    print(f"\nROC AUC Score: {roc_auc:.4f}")

if __name__ == "__main__":
    df = generar_datos_sinteticos()
    modelo_final = construir_pipeline_y_entrenar(df)
    logging.info("Proceso completado con éxito. El modelo está listo para despliegue.")