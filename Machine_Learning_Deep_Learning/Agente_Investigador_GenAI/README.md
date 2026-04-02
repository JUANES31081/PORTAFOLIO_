# Agente Investigador Inteligente (GenAI con Web Search)

Este proyecto demuestra la implementación de un **Agente de Inteligencia Artificial** moderno usando herramientas (Tool Calling) a través de los SDK de LangChain y la API de Google Gemini.

## 🌟 Características
* **Integración de SDK de LangChain**: Demuestra habilidades en la creación de flujos y agentes ReAct (Reason + Act).
* **Búsqueda Web Autónoma**: El agente tiene la capacidad de buscar datos en tiempo real de internet usando `DuckDuckGoSearchRun` sin depender únicamente del conocimiento interno del LLM.
* **Toma de Decisiones Lógicas**: Usando el modelo `gemini-1.5-flash`, el agente evalúa automáticamente si necesita buscar en internet para responder una pregunta.

## 🚀 Cómo utilizarlo

1. Asegúrate de tener las dependencias instaladas (referidas en el `requirements.txt` global del Portafolio):
    ```bash
    pip install langchain langchain-google-genai duckduckgo-search langchain-community
    ```

2. Exporta tu clave de la API de Google en el entorno:
    * **Windows (PowerShell)**: `$env:GOOGLE_API_KEY="tu_clave_aqui"`
    * **Linux/Mac**: `export GOOGLE_API_KEY="tu_clave_aqui"`

3. Ejecuta el Agente pasando el tema a investigar:
    ```bash
    python agent_web_search.py --query "Cuáles son las últimas noticias del telescopio James Webb?"
    ```

El agente documentará paso a paso cómo busca los resultados, evalúa el contexto en inglés/español y retornará una respuesta formal y clara.
