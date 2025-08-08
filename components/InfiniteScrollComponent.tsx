'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ArticleCard from './article-card';
import { Article } from '@/lib/data';
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton"


interface InfiniteScrollProps {
  initialData: Article[];
  fetchMore: (limit: number, offset: number) => Promise<Article[]>;
  batchSize?: number;
}

function InfiniteScrollComponent({
  initialData,
  fetchMore,
  batchSize = 10,
}: InfiniteScrollProps) {
  const [data, setData] = useState<Article[]>(initialData);
  const [offset, setOffset] = useState(initialData.length);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  // Set para tracking eficiente de IDs únicos
  const loadedIds = useRef(new Set(initialData.map(item => item.id)));
  
  // Ref para prevenir llamadas concurrentes
  const isLoadingRef = useRef(false);

  // useCallback necesario aquí porque se usa como dependencia del useEffect
  const loadData = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;
    setLoading(true);

    try {
      const newData = await fetchMore(batchSize, offset);

      if (newData.length === 0) {
        setHasMore(false);
        return;
      }

      // Filtrar duplicados usando Set
      const uniqueNewData = newData.filter(item => {
        if (loadedIds.current.has(item.id)) return false;
        loadedIds.current.add(item.id);
        return true;
      });

      if (uniqueNewData.length > 0) {
        setData(prevData => [...prevData, ...uniqueNewData]);
      }

      setOffset(prevOffset => prevOffset + newData.length);

      if (newData.length < batchSize) {
        setHasMore(false);
      }

    } catch (error) {
      console.error('Error loading data:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [fetchMore, batchSize, offset, hasMore]);

  useEffect(() => {
    const currentTarget = observerTarget.current;
    if (!currentTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          loadData();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    observer.observe(currentTarget);
    return () => observer.disconnect();
  }, [loadData, hasMore]);

  // Carga inicial si es necesario
  useEffect(() => {
    if (data.length === 0 && hasMore && !isLoadingRef.current) {
      const timeoutId = setTimeout(loadData, 100);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  return (
    <>
      {data.length === 0 && !loading && !hasMore && (
        <div>No hay elementos para mostrar.</div>
      )}

      {data.map((item) => (
        <ArticleCard key={item.id} article={item} />
      ))}

      {hasMore && (
        <div ref={observerTarget}>
          {loading && <ArticleCardSkeleton/>}
        </div>
      )}

      {!hasMore && data.length > 0 && (
        <div className="text-center">----</div>
      )}
    </>
  );
}

export default InfiniteScrollComponent;
