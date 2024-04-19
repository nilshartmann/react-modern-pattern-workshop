import {
  GetRecipeFeedbacksResponse,
  NewFeedback,
  PageResponseRecipeDto,
} from "@/app/components/api-types.ts";
import {
  fetchFromApi,
  getEndpointConfig,
} from "@/app/components/fetch-from-api.ts";
import {
  recipesPerPage,
  slowDown_AddFeedback,
  slowDown_GetFeedbacks,
  slowDown_GetRecipe,
  slowDown_GetRecipeList,
} from "@/app/demo-config.tsx";

export function fetchRecipes(
  page: number,
  orderBy?: "time" | "likes",
  ids?: string[],
): Promise<PageResponseRecipeDto> {
  const idsString = ids?.join(",");
  const result = fetchFromApi(
    getEndpointConfig("get", "/api/recipes"),
    {
      query: {
        page,
        size: recipesPerPage,
        sort: orderBy,
        ids: idsString,
        slowdown: slowDown_GetRecipeList,
        // @ts-ignore
        timer: Date.now(),
      },
    },
    ["recipes"],
  );

  return result;
}

export function fetchRecipe(recipeId: string) {
  return fetchFromApi(
    getEndpointConfig("get", "/api/recipes/{recipeId}"),
    {
      path: {
        recipeId,
      },
      query: {
        slowdown: slowDown_GetRecipe,
      },
    },
    [`recipes/${recipeId}`],
  );
}

export function fetchFeedback(
  recipeId: string,
): Promise<GetRecipeFeedbacksResponse> {
  return fetchFromApi(
    getEndpointConfig("get", "/api/recipes/{recipeId}/feedbacks"),
    {
      path: {
        recipeId,
      },
      query: {
        slowdown: slowDown_GetFeedbacks,
      },
    },
  );
}

export function saveFeedback(recipeId: string, newFeedback: NewFeedback) {
  return fetchFromApi(
    getEndpointConfig("post", "/api/recipes/{recipeId}/feedbacks"),
    {
      path: { recipeId },
      body: { feedbackData: newFeedback },
      query: {
        slowdown: slowDown_AddFeedback,
      },
    },
  );
}
