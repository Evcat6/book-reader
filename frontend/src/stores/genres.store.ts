import { LoadGenresResponseDto } from "@/common/dto";
import { DataStatus } from "@/common/enums";
import { genresApiService } from "@/services";
import { defineStore } from "pinia";

type State = {
    dataStatus: DataStatus;
    genres: LoadGenresResponseDto[];
}

const defaultState: State = {
    dataStatus: DataStatus.IDLE,
    genres: []
};

export const useGenresStore = defineStore('genres', {
    state: () => defaultState,
    actions: {
        async loadAll() {
            this.dataStatus = DataStatus.PENDING;
            const response = await genresApiService.loadAll();
            this.dataStatus = DataStatus.FULFILLED;
            this.genres = response;
        }
    }
})