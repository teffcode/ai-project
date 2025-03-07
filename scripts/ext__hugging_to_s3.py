from datasets import load_dataset
from transform import transform_to_json, transform_to_safe_eval
import boto3
import fire
import pandas as pd
import io
import os 
import swifter

AWS_ACCESS_KEY="AKIAWT3FL27M2NQ3LSTG" # os.environ.get('AWS_ACCESS_KEY')
AWS_SECRET_KEY="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" # os.environ.get('AWS_SECRET_KEY')
AWS_REGION="us-east-2" # os.environ.get('AWS_REGION')

BUCKET_NAME="software-engineer-interview-test-bucket-1"
BUCKET_FOLDER="images"

def main():

    url_endpoint = "Qdrant/wolt-food-clip-ViT-B-32-embeddings"

    # Load dataset
    dataset = load_dataset(url_endpoint)

    # Connect to S3
    s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY, region_name=AWS_REGION)

    # Convert to DataFrame first 500k rows
    df = pd.DataFrame(dataset['train'][:500000])

    # Transform data
    df["cafe"] = df["cafe"].swifter.apply(transform_to_json)
    df["vector"] = df["vector"].swifter.apply(transform_to_safe_eval)


    chunk_size = 50000  # Chunk size
    for i, chunk in enumerate(range(0, len(df), chunk_size)):
        df_chunk = df.iloc[chunk:chunk + chunk_size]  # Get chunk

        # Convert bytes to string
        
        file_name = f"images_{i+1}.parquet" # File name

        # Save in Memory
        buffer = io.BytesIO()
        df_chunk.to_parquet(buffer, engine="pyarrow")
        buffer.seek(0)

        # Upload to S3
        s3.upload_fileobj(buffer, BUCKET_NAME, f"{BUCKET_FOLDER}/{file_name}")

if __name__ == '__main__':
    fire.Fire(main)