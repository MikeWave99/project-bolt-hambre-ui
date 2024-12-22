import { ThemeProvider } from './components/theme-provider';
import { Header } from './components/Header';
import { RestaurantMap } from './components/Map/RestaurantMap';
import { RestaurantFilters } from './components/Filters/RestaurantFilters';
import { useRestaurants } from './lib/hooks/useRestaurants';
import { useGeolocation } from './lib/hooks/useGeolocation';
import { MADRID_CENTER, DEFAULT_RADIUS } from './lib/constants';
import type { FilterState, MapState } from './lib/types';
import { useState } from 'react';

function App() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priceRange: [],
    cuisineTypes: [],
    dietaryOptions: [],
    radius: DEFAULT_RADIUS,
    rating: 0
  });

  const [mapState, setMapState] = useState<MapState>({
    center: MADRID_CENTER,
    zoom: 13
  });

  const { location: userLocation, loading: isLocating, requestLocation } = useGeolocation();
  const { restaurants, loading, error } = useRestaurants(filters, userLocation);

  return (
    <ThemeProvider defaultTheme="system" storageKey="hambre-theme">
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Encuentra tu restaurante ideal en Madrid
          </h1>
          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
            <div className="space-y-8">
              <RestaurantFilters
                onFilterChange={setFilters}
                onLocationRequest={requestLocation}
                isLocating={isLocating}
              />
              {error && (
                <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg">
                  {error}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                {loading ? (
                  'Cargando restaurantes...'
                ) : (
                  `${restaurants.length} restaurantes encontrados`
                )}
              </div>
            </div>
            <div className="space-y-8">
              <RestaurantMap
                restaurants={restaurants}
                userLocation={userLocation}
                searchRadius={filters.radius}
                center={userLocation || mapState.center}
                zoom={mapState.zoom}
              />
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;