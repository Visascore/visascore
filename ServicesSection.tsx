import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowRight, Sparkles } from 'lucide-react';
import { services } from '../../data/homePageData';

interface ServicesSectionProps {
  onServiceClick: (href: string) => void;
}

export function ServicesSection({ onServiceClick }: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div></div>
  );
}