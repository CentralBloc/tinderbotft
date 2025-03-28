import axios from "axios"

export const updateProfilePicture = async (profile_picture: File) => {
    const formData = new FormData()
    formData.append("profile_picture", profile_picture)

    // Log the file details to verify it's being added correctly
    console.log("File being uploaded:", {
        name: profile_picture.name,
        type: profile_picture.type,
        size: profile_picture.size,
    })

    const response = await axios.patch("/update-profile-picture/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return response.data
}
