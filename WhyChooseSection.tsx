import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Trophy } from 'lucide-react';
import { whyChooseUs } from '../../data/homePageData';

export function WhyChooseSection() {
  return (
    <section className="py-8 md:py-16">
      <div className="container mx-auto px-4 mobile-container">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <Badge className="bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary px-4 py-2">
            <Trophy className="w-4 h-4 mr-2" />
            Why Choose Visa Score
          </Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl">
            <span className="block text-foreground">Comprehensive Visa</span>
            <span className="block bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Eligibility Assessment
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            AI-powered eligibility scoring with real UKVI data, personalized action plans, and step-by-step guidance for all UK visa routes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUs.map((feature, index) => (
            <Card key={index} className="border-0 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 mobile-card group hover:shadow-xl hover:shadow-primary/10">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}