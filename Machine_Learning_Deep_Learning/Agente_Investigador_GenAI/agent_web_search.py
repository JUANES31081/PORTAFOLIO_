import os
import argparse
import logging
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.tools import Tool

# Configuración del log
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def create_research_agent(api_key=None):
    """
    Construye y retorna un Agente Inteligente provisto de herramientas (Tools).
    Utiliza el paradigma de "Tool Calling" de LangChain.
    """
    logging.info("Inicializando herramientas (Tools) del Agente...")
    # 1. Definir la herramienta de búsqueda (DuckDuckGo es libre y no requiere API Key)
    search_tool = DuckDuckGoSearchRun()
    
    tools = [
        Tool(
            name="Busqueda_Web",
            func=search_tool.run,
            description="Útil para buscar información en internet sobre noticias actuales, datos recientes o eventos."
        )
    ]
    
    # 2. Configurar el LLM (Gemini de Google, excelente para agentes)
    # Importante: Requiere variable de entorno GOOGLE_API_KEY
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash", 
        temperature=0.3,
        google_api_key=api_key or os.getenv("GOOGLE_API_KEY")
    )
    
    # 3. Definir el Prompt Principal (System Prompt)
    prompt = ChatPromptTemplate.from_messages([
        ("system", "Eres un asistente de investigación de inteligencia artificial. Tienes acceso a herramientas de búsqueda en la web. "
                   "Siempre que te pregunten algo de lo cual no tengas certeza o requiera datos actuales, debes usar la herramienta 'Busqueda_Web'. "
                   "Formula tu respuesta final de forma muy profesional en idioma español, estructurada y concisa."),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}"),
    ])
    
    logging.info("Ensamblando la arquitectura del Agente...")
    # 4. Crear el Agente y su Ejecutor (el ejecutor se encarga del bucle Pensamiento -> Acción -> Observación)
    agent = create_tool_calling_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
    
    return agent_executor

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Agente de IA Investigador con conexión a Internet")
    parser.add_argument("--query", type=str, required=True, help="La pregunta o investigación a realizar.")
    args = parser.parse_args()
    
    if not os.getenv("GOOGLE_API_KEY"):
         logging.warning("Atención: No se encontró la variable de entorno GOOGLE_API_KEY. "
                         "El agente requerirá la llave de la API de Gemini para funcionar correctamente.")
         
    logging.info(f"El usuario solicitó investigar: '{args.query}'")
    
    agente = create_research_agent()
    
    try:
        logging.info("Iniciando ejecución del agente (Reason + Act)...")
        # Invocamos al agente con nuestra query
        respuesta = agente.invoke({"input": args.query})
        
        print("\n" + "="*60)
        print("🤖 RESPUESTA FINAL DEL AGENTE:")
        print("="*60)
        print(respuesta["output"])
        print("="*60 + "\n")
        
    except Exception as e:
        logging.error(f"Error durante la ejecución del agente: {e}")
