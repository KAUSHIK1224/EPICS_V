import Header from "@/components/Header";
import AdminForm from "@/components/AdminForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bird, Plus } from "lucide-react";

export default function Admin() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bird className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold" data-testid="text-admin-title">
              Species Management
            </h1>
          </div>
          <p className="text-muted-foreground" data-testid="text-admin-subtitle">
            Add and manage bird species in the catalog
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base" data-testid="text-stat-total">Total Species</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-stat-total-value">156</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base" data-testid="text-stat-ar-models">AR Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-stat-ar-models-value">45</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base" data-testid="text-stat-pending">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-stat-pending-value">3</div>
            </CardContent>
          </Card>
        </div>

        <AdminForm />
      </div>
    </div>
  );
}
