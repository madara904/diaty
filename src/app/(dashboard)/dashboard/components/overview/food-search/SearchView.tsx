import { Search, Plus, Edit, Trash, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/app/components/ui/dialog";
import { FoodItem, OpenFoodProduct, SavedFoodItem } from "./types";

interface SearchViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  handleSearch: (e: React.FormEvent) => void;
  showCustomFoodForm: () => void;
  mealItems: SavedFoodItem[] | undefined;
  defaultMealType: string;
  handleSelectFood: (food: FoodItem) => void;
  handleEditFood: (item: SavedFoodItem) => void;
  handleDeleteFood: (id: string) => void;
  openFoodResults: OpenFoodProduct[];
  communityResults: SavedFoodItem[];
  searchError: string;
}

export function SearchView({
  searchQuery,
  setSearchQuery,
  isSearching,
  handleSearch,
  showCustomFoodForm,
  mealItems,
  defaultMealType,
  handleSelectFood,
  handleEditFood,
  handleDeleteFood,
  openFoodResults,
  communityResults,
  searchError
}: SearchViewProps) {
  // Filter community results to only show custom foods (isUserData or isOtherUserData)
  const filteredCommunityResults = communityResults.filter(
    food => food.isUserData || food.isOtherUserData
  );

  return (
    <>
      <DialogHeader className="mb-4">
        <DialogTitle>Add Food Intake</DialogTitle>
        <DialogDescription>
          Search for food or add a custom entry.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 mt-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search for food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isSearching}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={showCustomFoodForm}
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Custom Food
          </Button>
        </div>
        
        {/* Display Items for the current meal type */}
        {mealItems && mealItems.length > 0 && !searchQuery && (
          <div className="space-y-2">
            <h3 className="font-medium">Items for {defaultMealType.charAt(0) + defaultMealType.slice(1).toLowerCase()}</h3>
            <div className="space-y-2">
              {mealItems.map((item: SavedFoodItem) => (
                <Card key={item.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardContent className="p-3" onClick={() => handleSelectFood(item)}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{item.name || "Unnamed Food"}</h4>
                        <p className="text-sm text-muted-foreground">
                           {Math.round(Number(item.calories))} kcal
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleEditFood(item); }} className="hover:bg-accent">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={(e) => { e.stopPropagation(); handleDeleteFood(item.id); }}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => { e.stopPropagation(); handleSelectFood(item); }}
                          className="text-emerald-600 border-emerald-300 hover:bg-accent/50 transition-colors"
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      
        {/* Search Results */}
        <div className="mt-4">
          {searchQuery && (
            <>
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                  <p className="text-sm text-muted-foreground text-center">
                    Searching OpenFoodFacts database...<br />
                    This may take a few seconds
                  </p>
                </div>
              ) : (
                <>
                  {searchError && (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">{searchError}</p>
                      <Button variant="link" onClick={showCustomFoodForm}>
                        Add as a custom food
                      </Button>
                    </div>
                  )}
                  {!searchError && (openFoodResults.length > 0 || filteredCommunityResults.length > 0) && (
                    <div className="space-y-4 mt-4">
                      {/* OpenFoodFacts Results */}
                      {openFoodResults.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">OpenFoodFacts Results</h3>
                          {openFoodResults.map((product, index) => (
                            <Card key={`open-${index}`} className="cursor-pointer hover:bg-accent/50 transition-colors">
                              <CardContent className="p-3" onClick={() => handleSelectFood(product)}>
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-medium">
                                      {product.product_name}
                                      {product.brand && <span className="text-sm text-muted-foreground ml-2">({product.brand})</span>}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      <span className="font-medium">
                                        {Math.round(Number(product.nutriments["energy-kcal_100g"]))} kcal/100g
                                      </span>
                                    </p>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="default"
                                    className="border-emerald-300 hover:bg-emerald-600"
                                  >
                                    Select
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* Community Results (Custom Foods) */}
                      {filteredCommunityResults.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Community Custom Foods</h3>
                          {filteredCommunityResults.map((food) => (
                            <Card key={`community-${food.id}`} className="cursor-pointer hover:bg-accent/50 transition-colors">
                              <CardContent className="p-3" onClick={() => handleSelectFood(food)}>
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-medium flex items-center gap-2">
                                      {food.name}
                                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                                        {food.isUserData ? 'Your Custom Food' : 'Community Food'}
                                      </Badge>
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      <span className="font-medium">
                                        {Math.round(Number(food.calories))} kcal/100g
                                      </span>
                                    </p>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="default"
                                    className="border-emerald-300 hover:bg-emerald-600"
                                  >
                                    Select
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
} 