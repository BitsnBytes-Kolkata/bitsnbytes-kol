import { supabase } from "./supabase"
import { pipeline } from "@xenova/transformers"

let extractor: any = null

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
      quantized: true,
    })
  }

  const output = await extractor(text.replace(/\n/g, " "), { pooling: "mean", normalize: true })
  return Array.from(output.data)
}

export async function searchSiteContent(query: string, matchCount = 3): Promise<string[]> {
  const queryEmbedding = await generateEmbedding(query)

  // This relies on a Postgres function:
  /*
    create or replace function match_site_sections (
      query_embedding vector(384),
      match_threshold float,
      match_count int
    )
    returns table (
      id uuid,
      page text,
      section text,
      content text,
      similarity float
    )
    language sql stable
    as $$
      select
        site_embeddings.id,
        site_embeddings.page,
        site_embeddings.section,
        site_embeddings.content,
        1 - (site_embeddings.embedding <=> query_embedding) as similarity
      from site_embeddings
      where 1 - (site_embeddings.embedding <=> query_embedding) > match_threshold
      order by site_embeddings.embedding <=> query_embedding
      limit match_count;
    $$;
  */

  const { data, error } = await supabase.rpc("match_site_sections", {
    query_embedding: queryEmbedding,
    match_threshold: 0.5, // Reduced threshold since MiniLM vectors behave slightly differently than ada-002
    match_count: matchCount,
  })

  if (error) {
    console.error("Error searching embeddings:", error)
    return []
  }

  return (data as any[]).map(d => d.content)
}
