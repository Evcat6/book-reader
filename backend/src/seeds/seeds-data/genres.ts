import { Environment } from "../../common/config/config";
import { GenreEntity } from "../../genre/entity/genre.entity";

const genres = [
    new GenreEntity({ name: "Fiction" }),
    new GenreEntity({ name: "Non-Fiction" }),
    new GenreEntity({ name: "Academic & Educational" }),
    new GenreEntity({ name: "Children's Books" }),
    new GenreEntity({ name: "Lifestyle & Hobbies" }),
    new GenreEntity({ name: "Art & Photography" }),
    new GenreEntity({ name: "Religion & Spirituality" }),
    new GenreEntity({ name: "Comics & Graphic Novels" }),
    new GenreEntity({ name: "Miscellaneous" }),
    new GenreEntity({ name: "Special Collections" }),
];

export default function getByEnv(env: string): GenreEntity[] {
    if (env === Environment.PRODUCTION) {
        return genres;
    }
    if (env === Environment.DEVELOPMENT) {
        return genres;
    }
    if (env === Environment.TEST) {
        return genres;
    }
    return [];
}