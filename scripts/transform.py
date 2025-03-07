import numpy as np
import ast
import json

def transform_to_json(x):
    if isinstance(x, bytes):
        x = x.decode("utf-8")  # Decodifica si es bytes
    
    if isinstance(x, str):
        try:
            return json.loads(x)  # Convierte string a JSON
        except json.JSONDecodeError:
            return {}  # Si hay un error en el JSON, retorna un diccionario vacío
    
    if isinstance(x, dict):
        return x  # Si ya es dict, lo devuelve directamente

    return {}

def transform_to_safe_eval(x):
    try:
        if isinstance(x, bytes):
            x = x.decode("utf-8")
        return ast.literal_eval(x) if isinstance(x, str) else x
    except Exception as e:
        print(f"Error con el valor: {x}, Error: {e}")
        return None
    

def transform_as_list(x):
    return x.tolist() if isinstance(x, np.ndarray) else x