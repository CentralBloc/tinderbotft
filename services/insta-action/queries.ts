import axios from "@/lib/axios";
import {InstaAction} from "@/types";

interface PictureInterface {
  id?: string;
  file?: File;
}

export interface CreateInstaActionPayload {
  insta_strat: string
  actions: Array<{
    action_type: "setup" | "post" | "story" | "reels"
    profile_pictures?: PictureInterface[]
    stories?: PictureInterface[]
    posts?: PictureInterface[]
    following_username?: string
    username?: string[] | null
    bio_list?: string[] | null
    time?: string
    related_day: string
  }>
}

export const getInstaActions = async (): Promise<InstaAction[]> => {
  const response = await axios.get(`/insta-actions}`)
  return response.data
}

export const getStratAction = async (stratId: string): Promise<InstaAction[]> => {
  const response = await axios.get(`/get-strat-actions/${stratId}/`)
  return response.data
}

export const getInstaActionById = async (actionId: string): Promise<InstaAction> => {
  const response = await axios.get(`/insta-actions/${actionId}/`)
  return response.data
}

export const createInstaActions = async (payload: CreateInstaActionPayload): Promise<InstaAction[]> => {
  const formData = new FormData()
  formData.append("insta_strat", payload.insta_strat)

  payload.actions.forEach((action, index) => {
    formData.append(`actions[${index}][action_type]`, action.action_type)
    formData.append(`actions[${index}][related_day]`, action.related_day)

    if (action.time) {
      formData.append(`actions[${index}][time]`, action.time)
    }

    if (action.following_username) {
      formData.append(`actions[${index}][following_username]`, action.following_username)
    }

    if (action.username) {
      formData.append(`actions[${index}][username]`, JSON.stringify(action.username))
    }

    if (action.bio_list) {
      formData.append(`actions[${index}][bio_list]`, JSON.stringify(action.bio_list))
    }

    if (action.profile_pictures && action.profile_pictures.length > 0) {
      action.profile_pictures.forEach((pic, picIndex) => {
        if (pic.file) {
          formData.append(`actions[${index}][profile_pictures][${picIndex}]`, pic.file)
        } else if (pic.id) {
          formData.append(`actions[${index}][profile_pictures_ids][${picIndex}]`, pic.id)
        }
      })
    }

    if (action.stories && action.stories.length > 0) {
      action.stories.forEach((story, storyIndex) => {
        if (story.file) {
          formData.append(`actions[${index}][stories][${storyIndex}]`, story.file)
        } else if (story.id) {
          formData.append(`actions[${index}][stories_ids][${storyIndex}]`, story.id)
        }
      })
    }

    if (action.posts && action.posts.length > 0) {
      action.posts.forEach((post, postIndex) => {
        if (post.file) {
          formData.append(`actions[${index}][posts][${postIndex}]`, post.file)
        } else if (post.id) {
          formData.append(`actions[${index}][posts_ids][${postIndex}]`, post.id)
        }
      })
    }
  })

  const response = await axios.post("/api/insta-actions/bulk/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export const updateInstaAction = async (actionId: string, data: Partial<InstaAction>): Promise<InstaAction> => {
  const formData = new FormData()

  if (data.action_type) formData.append("action_type", data.action_type)
  if (data.insta_strat) formData.append("insta_strat", data.insta_strat)
  if (data.following_username) formData.append("following_username", data.following_username)
  if (data.time) formData.append("time", data.time)
  if (data.related_day) formData.append("related_day", data.related_day)

  if (data.username) formData.append("username", JSON.stringify(data.username))
  if (data.bio_list) formData.append("bio_list", JSON.stringify(data.bio_list))

  if (data.profile_pictures) {
    data.profile_pictures.forEach((pic, index) => {
      if (pic.file) {
        formData.append(`profile_pictures[${index}]`, pic.file)
      } else if (pic.id) {
        formData.append(`profile_pictures_ids[${index}]`, pic.id)
      }
    })
  }

  if (data.stories) {
    data.stories.forEach((story, index) => {
      if (story.file) {
        formData.append(`stories[${index}]`, story.file)
      } else if (story.id) {
        formData.append(`stories_ids[${index}]`, story.id)
      }
    })
  }

  if (data.posts) {
    data.posts.forEach((post, index) => {
      if (post.file) {
        formData.append(`posts[${index}]`, post.file)
      } else if (post.id) {
        formData.append(`posts_ids[${index}]`, post.id)
      }
    })
  }

  const response = await axios.patch(`/api/insta-actions/${actionId}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export const deleteInstaAction = async (actionId: string): Promise<void> => {
  await axios.delete(`/api/insta-actions/${actionId}/`)
}