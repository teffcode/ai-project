from sqlalchemy import create_engine
import boto3
import json
import pandas as pd
import numpy as np
import psycopg2
import tqdm
import swifter
import fire
import io 

AWS_ACCESS_KEY="AKIAWT3FL27M2NQ3LSTG" # os.environ.get('AWS_ACCESS_KEY')
AWS_SECRET_KEY="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" # os.environ.get('AWS_SECRET_KEY')
AWS_REGION="us-east-2" # os.environ.get('AWS_REGION')

USR_PSW="snappr"
KEY_PSW="OYeTFSsi4LLZ4qlGwR14"
HOST_PSW="software-engineer-interview-test-db-1.cluster-ccf5q9owrldj.us-east-2.rds.amazonaws.com"
PUERTO_PSW="5432"  # PostgreSQL usa el puerto 5432 por defecto
DB_PSW="postgres"

BUCKET_NAME = "BUCKET_NAME"
BUCKET_FOLDER = "images"

def main():
    
    # Connect to S3
    s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY, region_name=AWS_REGION)

    # Connect to PostgreSQL
    engine = create_engine(f"postgresql+psycopg2://{USR_PSW}:{KEY_PSW}@{HOST_PSW}:{PUERTO_PSW}/{DB_PSW}")

    # Get list of files
    response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=BUCKET_FOLDER)

    # Get list of files
    file_keys= [obj["Key"] for obj in response.get("Contents", []) if obj["Key"].endswith((".parquet", ".csv"))]

    for file_key in tqdm(file_keys, desc="Descargando archivos"):
        
        obj = s3.get_object(Bucket=BUCKET_NAME, Key=file_key)
        file_stream = io.BytesIO(obj["Body"].read())

        df = pd.read_parquet(file_stream)

        json_aplanado = pd.json_normalize(df['cafe'], meta_prefix='cafe__')

        df = df.join(json_aplanado, rsuffix="_cafe")

        df['vector'] = df["vector"].swifter.apply(lambda x: x.tolist() if isinstance(x, np.ndarray) else x)
        df['categories'] = df["categories"].swifter.apply(lambda x: x.tolist() if isinstance(x, np.ndarray) else x)   
        #df["cafe"] = df["cafe"].swifter.apply(lambda x: json.dumps(x) if isinstance(x, dict) else dict)

        df = df.drop(columns=['cafe', 'location'])
        df.columns = [column.replace('.', '_') for column in df.columns] 

        df.to_sql("images", engine, if_exists="append", index=False)

if __name__ == '__main__':
    fire.Fire(main)
    