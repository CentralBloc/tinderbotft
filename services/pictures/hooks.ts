import {getPicture} from "@/services/pictures/queries";
import {useQuery} from "@tanstack/react-query";


export const pituresQueryKeys = {
    picturesKey: 'pictures',
    pictureKey: (id: string) => ['picture', { id }],
    addPictureKey: 'addPicture',
    updatePictureKey: (id: string) => ['updatePicture', { id }],
    removePictureKey: (id: string) => ['removePicture', { id }],
}

export const usePicture = (id: string) => {
    return useQuery({
        queryKey: pituresQueryKeys.pictureKey(id),
        queryFn: () => getPicture(id),
    })
}