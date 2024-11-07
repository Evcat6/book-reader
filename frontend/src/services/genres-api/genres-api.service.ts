import { ContentType, HttpMethod } from "@/common/enums";
import { HttpService } from "../http/http.service";
import { LoadGenresResponseDto } from "@/common/dto";


class GenresApiService {
    public constructor(private httpService: HttpService, private baseEndpoint: string) {}

    public async loadAll() {
        const response = await this.httpService.load(`${this.baseEndpoint}`, {
            method: HttpMethod.GET,
            contentType: ContentType.APPLICATION_JSON,
        });
        return await response.json<LoadGenresResponseDto[]>();
    }
    
}

export { GenresApiService };