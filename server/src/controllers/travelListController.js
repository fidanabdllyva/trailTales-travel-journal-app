const travelListService = require('../services/travelListService');
const formatMongoData = require('../utils/formatMongoData');

module.exports = {
    // Create a new travel list
    async createList(req, res, next) {
        try {
            const userId = req.user.id;
            const { title, description, tags, isPublic } = req.body;
            const file = req.file;

            // Prepare data for service
            const listData = { title, description, tags, isPublic };

            // Call service
            const list = await travelListService.createTravelList(listData, file, userId);

            // Respond
            res.status(201).json({
                success: true,
                message: "Travel list created successfully",
                data: formatMongoData(list),
            });
        } catch (error) {
            next(error);
        }
    },

    // Get all public travel lists
    async getPublicLists(req, res, next) {
        try {
            const { page, limit, tag } = req.query;
            const result = await travelListService.getPublicTravelLists(page, limit, tag);

            res.json({
                message: 'Public travel lists retrieved successfully!',
                data: {
                    lists: formatMongoData(result.lists),
                    totalPages: result.totalPages,
                    currentPage: result.currentPage,
                    total: result.total
                }
            });
        } catch (error) {
            next(error);
        }
    },

    // Get all lists for the logged-in user
    async getAllLists(req, res, next) {
        try {
            const userId = req.user.id;
            const lists = await travelListService.getAllLists(userId);

            res.status(200).json({
                message: "Travel lists retrieved successfully!",
                data: formatMongoData(lists),
            });
        } catch (error) {
            next(error);
        }
    },

    // Get a single list by ID
    async getListById(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const list = await travelListService.getTravelList(id, userId);

            if (!list) {
                return res.status(404).json({
                    message: "Travel list not found!",
                    data: null,
                });
            }

            res.status(200).json({
                message: "Travel list retrieved successfully!",
                data: formatMongoData(list),
            });
        } catch (error) {
            if (error.message === "Travel list not found" || error.message === "You don't have access to this travel list") {
                return res.status(404).json({
                    message: error.message,
                    data: null,
                });
            }
            next(error);
        }
    },

    // Get user's own lists
    async getUserOwnLists(req, res, next) {
        try {
            const userId = req.user.id;
            const lists = await travelListService.getUserOwnLists(userId);

            res.status(200).json({
                message: "User's travel lists retrieved successfully!",
                data: formatMongoData(lists),
            });
        } catch (error) {
            next(error);
        }
    },

    // Get lists the user collaborates on
    async getUserCollaborativeLists(req, res, next) {
        try {
            const userId = req.user.id;
            const lists = await travelListService.getUserCollaborativeLists(userId);

            res.status(200).json({
                message: "Collaborative travel lists retrieved successfully!",
                data: formatMongoData(lists),
            });
        } catch (error) {
            next(error);
        }
    },

    // Update a travel list
    async updateList(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const { title, description, tags, isPublic, coverImage } = req.body;

            const updateData = { title, description, tags, isPublic, coverImage };

            const response = await travelListService.updateTravelList(id, updateData, userId);

            if (!response.success) {
                const statusCode = response.message === "Travel list not found" ? 404 : 403;
                return res.status(statusCode).json({
                    message: response.message,
                    data: null,
                });
            }

            res.status(200).json({
                message: response.message,
                data: formatMongoData(response.data),
            });
        } catch (error) {
            next(error);
        }
    },

    // Delete a travel list
    async deleteList(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const response = await travelListService.deleteTravelList(id, userId);

            if (!response.success) {
                const statusCode = response.message === "Travel list not found" ? 404 : 403;
                return res.status(statusCode).json({
                    message: response.message,
                    data: null,
                });
            }

            res.status(200).json({
                message: response.message,
                data: null,
            });
        } catch (error) {
            next(error);
        }
    },

    // Add collaborator (send invitation email)
    async addCollaboratorToList(req, res, next) {
        try {
            const { id } = req.params; 
            const { email } = req.body;
            const userId = req.user.id;

            if (!email) {
                return res.status(400).json({
                    message: "Collaborator email is required",
                    data: null,
                });
            }

            const response = await travelListService.addCollaborator(id, email, userId);

            if (!response.success) {
                const statusCode =
                    response.message === "Travel list not found" ||
                        response.message === "User with this email not found" ? 404 :
                        response.message === "Only the owner can add collaborators" ? 403 :
                            response.message === "User already has a pending invitation" ? 400 : 400;

                return res.status(statusCode).json({
                    message: response.message,
                    data: null,
                });
            }

            // Invitation sent successfully
            res.status(200).json({
                message: response.message,
                data: null, 
            });
        } catch (error) {
            next(error);
        }
    },

    // Remove collaborator
    async removeCollaboratorFromList(req, res, next) {
        try {
            const { id, collaboratorId } = req.params; // list id and collaborator id
            const userId = req.user.id;

            const response = await travelListService.removeCollaborator(id, collaboratorId, userId);

            if (!response.success) {
                const statusCode =
                    response.message === "Travel list not found" ? 404 :
                        response.message === "Only the owner can remove collaborators" ? 403 : 400;

                return res.status(statusCode).json({
                    message: response.message,
                    data: null,
                });
            }

            res.status(200).json({
                message: response.message,
                data: formatMongoData(response.data),
            });
        } catch (error) {
            next(error);
        }
    },


    // Add destination
    async addDestinationToList(req, res, next) {
        try {
            const { id } = req.params;
            const { destinationId } = req.body;
            const userId = req.user.id;

            if (!destinationId) {
                return res.status(400).json({
                    message: "Destination ID is required",
                    data: null,
                });
            }

            const response = await travelListService.addDestination(id, destinationId, userId);

            if (!response.success) {
                const statusCode =
                    response.message === "Travel list not found" ? 404 :
                        response.message === "You don't have permission to add destinations to this list" ? 403 : 400;

                return res.status(statusCode).json({
                    message: response.message,
                    data: null,
                });
            }

            res.status(200).json({
                message: response.message,
                data: formatMongoData(response.data),
            });
        } catch (error) {
            next(error);
        }
    },

    // Remove destination
    async removeDestinationFromList(req, res, next) {
        try {
            const { id, destinationId } = req.params;
            const userId = req.user.id;

            const response = await travelListService.removeDestination(id, destinationId, userId);

            if (!response.success) {
                const statusCode =
                    response.message === "Travel list not found" ? 404 :
                        response.message === "You don't have permission to remove destinations from this list" ? 403 : 400;

                return res.status(statusCode).json({
                    message: response.message,
                    data: null,
                });
            }

            res.status(200).json({
                message: response.message,
                data: formatMongoData(response.data),
            });
        } catch (error) {
            next(error);
        }
    }
};
