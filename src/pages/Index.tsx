
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout/Layout";
import { Link } from "react-router-dom";
import { usePropertyStore } from "@/store/propertyStore";
import { Home, MapPin, Plus, BarChart2, Search } from "lucide-react";
import { Summary } from "@/components/Dashboard/Summary";
import { PriceChart } from "@/components/Charts/PriceChart";

const Index = () => {
  const properties = usePropertyStore((state) => state.properties);
  
  return (
    <Layout>
      <div className="space-y-8">
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Track and manage your rental property search in one place
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/add-property" className="flex items-center gap-2">
                  <Plus size={16} />
                  Add Property
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/properties" className="flex items-center gap-2">
                  <Search size={16} />
                  View All
                </Link>
              </Button>
            </div>
          </div>
          
          <Summary />
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="h-[300px]">
                <h2 className="text-xl font-semibold mb-4">Price Distribution</h2>
                <PriceChart />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" size="lg" className="h-auto py-4" asChild>
                  <Link to="/properties" className="flex flex-col items-center text-center gap-2">
                    <Home className="h-8 w-8" />
                    <div>
                      <p className="font-medium">Properties</p>
                      <p className="text-sm text-muted-foreground">View saved properties</p>
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" className="h-auto py-4" asChild>
                  <Link to="/map" className="flex flex-col items-center text-center gap-2">
                    <MapPin className="h-8 w-8" />
                    <div>
                      <p className="font-medium">Map View</p>
                      <p className="text-sm text-muted-foreground">See properties on map</p>
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" className="h-auto py-4" asChild>
                  <Link to="/comparison" className="flex flex-col items-center text-center gap-2">
                    <BarChart2 className="h-8 w-8" />
                    <div>
                      <p className="font-medium">Compare</p>
                      <p className="text-sm text-muted-foreground">Compare properties</p>
                    </div>
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" className="h-auto py-4" asChild>
                  <Link to="/add-property" className="flex flex-col items-center text-center gap-2">
                    <Plus className="h-8 w-8" />
                    <div>
                      <p className="font-medium">Add New</p>
                      <p className="text-sm text-muted-foreground">Add new property</p>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {properties.length > 0 ? (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recently Added Properties</h2>
              <Button variant="link" asChild>
                <Link to="/properties">View all</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.slice(0, 3).map((property) => (
                <Link key={property.id} to={`/properties/${property.id}`}>
                  <Card className="hover:shadow-md transition-all overflow-hidden h-full">
                    <div className="aspect-video bg-muted relative">
                      {property.image ? (
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-secondary/20">
                          <Home className="h-10 w-10 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{property.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{property.location}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="font-medium">${property.price}/mo</p>
                        <p className="text-sm text-muted-foreground">
                          {property.bedrooms} bd | {property.bathrooms} ba
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </Layout>
  );
};

export default Index;
