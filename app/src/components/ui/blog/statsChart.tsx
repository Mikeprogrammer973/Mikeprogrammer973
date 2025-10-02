
'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { supabase } from 'mdp/lib/supabase/client';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StatsChartsProps {
  userId: string;
}

export default function StatsCharts({ userId }: StatsChartsProps) {
  const [stats, setStats] = useState({
    postsByStatus: { published: 0, pending: 0, draft: 0 },
    likesOverTime: [] as { month: string; likes: number }[],
    viewsByPost: [] as { title: string; views: number }[],
    categoryDistribution: [] as { category: string; count: number }[]
  });
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      // Buscar posts do usuário
      const { data: posts } = await supabase
        .from('blog_posts')
        .select(`*, likes:blog_likes(id, author_id), category:blog_posts_categories(name)`)
        .eq('author_id', userId)
        .order('published_at', { ascending: true });

      if (!posts) return;

      // por status
      const postsByStatus = {
        published: posts.filter(post => post.status === 'published').length,
        pending: posts.filter(post => post.status === 'pending').length,
        draft: posts.filter(post => post.status === 'draft').length
      };

      // likes ao longo do tempo
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const monthlyLikes = posts
        .filter(post => new Date(post.published_at) >= sixMonthsAgo)
        .reduce((acc, post) => {
          const month = new Date(post.published_at).toLocaleDateString('pt-BR', { 
            month: 'short', 
            year: '2-digit' 
          });
          acc[month] = (acc[month] || 0) + (post.likes.length || 0);
          return acc;
        }, {} as Record<string, number>);

      const likesOverTime = Object.entries(monthlyLikes)
        .map(([month, likes]) => ({ month, likes: Number(likes) }))
        .slice(-6);

      // mais visualizados
      const viewsByPost = posts
        .filter(post => post.views > 0)
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)
        .map(post => ({
          title: post.title.length > 20 ? post.title.substring(0, 20) + '...' : post.title,
          views: post.views || 0
        }));

      // por categoria
      const categoryDistribution = posts.reduce((acc, post) => {
        acc[post.category.name || 'Sem Categoria'] = (acc[post.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const categoryData = Object.entries(categoryDistribution)
        .map(([category, count]) => ({ category, count}))
        .sort((a, b) => Number(b.count) - Number(a.count))

      setStats({
        postsByStatus,
        likesOverTime,
        viewsByPost,
        categoryDistribution: categoryData as { category: string; count: number }[]
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusData = {
    labels: ['Publicados', 'Pendentes', 'Rascunhos'],
    datasets: [
      {
        label: 'Quantidade de Artigos',
        data: [
          stats.postsByStatus.published,
          stats.postsByStatus.pending,
          stats.postsByStatus.draft
        ],
        backgroundColor: [
          'hsl(142, 76%, 36%)',
          'hsl(38, 92%, 50%)',  
          'hsl(215, 14%, 34%)'
        ],
        borderColor: [
          'hsl(142, 76%, 36%)',
          'hsl(38, 92%, 50%)',
          'hsl(215, 14%, 34%)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const likesData = {
    labels: stats.likesOverTime.map(item => item.month),
    datasets: [
      {
        label: 'Likes Recebidos',
        data: stats.likesOverTime.map(item => item.likes),
        borderColor: 'hsl(221, 83%, 53%)',
        backgroundColor: 'hsla(221, 83%, 53%, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: stats.categoryDistribution.map(item => item.category),
    datasets: [
      {
        label: 'Artigos por Categoria',
        data: stats.categoryDistribution.map(item => item.count),
        backgroundColor: [
          'hsl(221, 83%, 53%)',
          'hsl(262, 83%, 58%)',
          'hsl(201, 96%, 32%)',
          'hsl(142, 76%, 36%)',
          'hsl(38, 92%, 50%)',
          'hsl(339, 90%, 51%)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const viewsData = {
    labels: stats.viewsByPost.map(item => item.title),
    datasets: [
      {
        label: 'Visualizações',
        data: stats.viewsByPost.map(item => item.views),
        backgroundColor: 'hsla(201, 96%, 32%, 0.8)',
        borderColor: 'hsl(201, 96%, 32%)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'hsl(221.2, 83.2%, 53.3%)',
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        color: 'hsl(221.2, 83.2%, 53.3%)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'hsla(215.4, 16.3%, 46.9%, 0.1)',
        },
        ticks: {
          color: 'hsl(215.4, 16.3%, 46.9%)',
        },
      },
      x: {
        grid: {
          color: 'hsla(215.4, 16.3%, 46.9%, 0.1)',
        },
        ticks: {
          color: 'hsl(215.4, 16.3%, 46.9%)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          color: 'hsl(221.2, 83.2%, 53.3%)',
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="h-64 bg-[hsl(var(--muted))] rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--primary))]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[hsl(var(--card))] border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Artigos por Status</h3>
        <div className="h-64">
          <Doughnut data={statusData} options={doughnutOptions} />
        </div>
      </div>

      <div className="bg-[hsl(var(--card))] border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Evolução de Likes</h3>
        <div className="h-64">
          <Line data={likesData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-[hsl(var(--card))] border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Artigos por Categoria</h3>
        <div className="h-64">
          <Doughnut data={categoryData} options={doughnutOptions} />
        </div>
      </div>

      <div className="bg-[hsl(var(--card))] border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Artigos Mais Populares</h3>
        <div className="h-64">
          <Bar data={viewsData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}