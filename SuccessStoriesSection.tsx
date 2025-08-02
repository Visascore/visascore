import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Star, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { successStories } from '../../data/homePageData';

export function SuccessStoriesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1) % successStories.length);
  };

  const prevStory = () => {
    setCurrentIndex((prev) => (prev - 1 + successStories.length) % successStories.length);
  };

  const currentStory = successStories[currentIndex];

  return (
    <section className="py-16 bg-gradient-to-br from-background via-background to-card/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <UserCheck className="h-6 w-6 text-primary" />
            <Badge className="bg-primary/20 text-primary border-primary/30">
              Success Stories
            </Badge>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
            Real Success Stories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how our AI-powered platform has helped thousands achieve their UK visa dreams
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-2xl mx-auto">
          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevStory}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background border-border/50 hover:border-primary/50 transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextStory}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background border-border/50 hover:border-primary/50 transition-all duration-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Story Card */}
          <Card className="border-0 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 mobile-card group hover:shadow-xl hover:shadow-primary/10 mx-8">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Rating and Score */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    {currentStory.score}
                  </Badge>
                </div>

                {/* Quote */}
                <blockquote className="text-sm text-muted-foreground leading-relaxed italic text-center px-4">
                  "{currentStory.quote}"
                </blockquote>

                {/* Author Info */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">{currentStory.name}</div>
                      <div className="text-xs text-muted-foreground">{currentStory.country}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {currentStory.visa}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Story Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {successStories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation Info */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            {currentIndex + 1} of {successStories.length} stories
          </p>
        </div>
      </div>
    </section>
  );
}