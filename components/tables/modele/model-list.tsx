"use client";

import {useModels} from "@/services/models/hooks";

import {DataTable} from "@/components/ui/data-table";
import {modelListColumns} from "@/components/tables/modele/model-columns";


export default function ModelList() {
    const {data: models = [], isLoading, isError} = useModels();
    console.log("models", models)
    return (
        <div className="space-y-5">
            <h1 className="font-heading">Models list</h1>

            <div className="space-y-6">
                <DataTable columns={modelListColumns} data={models ?? []}/>
            </div>
        </div>
    );
}
