import { Box, Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import { useState } from "react"
import { api } from "../services/api"

export interface PostData {
    userId: number
    id: number
    title: string
    body: string
}

export interface PostProps {
    data: PostData
    onDelete: (id: number) => void
}

function Post({ data, onDelete }: PostProps) {
    const { userId, id, title, body } = data

    const [comment, setComment] = useState('')
    const [comments, setComments] = useState<string[]>([])

    const { isOpen: isActionsModalOpen, onOpen: onActionsModalOpen, onClose: onActionsModalClose } = useDisclosure()
    const { isOpen: isConfirmModalOpen, onOpen: onConfirmModalOpen, onClose: onConfirmModalClose } = useDisclosure()
    const { isOpen: isCommentModalOpen, onOpen: onCommentModalOpen, onClose: onCommentModalClose } = useDisclosure()

    const handleDelete = async () => {
        onDelete(id)

        setComments([])

        onConfirmModalClose()
        onActionsModalClose()
    }

    const handleNewComment = async () => {
        try {
            const requestBody = {
                id: id,
                userId: userId,
                title: title,
                body: body
            }

            const response = await api.post('comments', requestBody)

            console.log(response.data)

            setComments(prevComments => [...prevComments, comment])
            setComment('')
            onCommentModalClose()
            onActionsModalClose()
        } catch (error) {
            console.log('Erro ao enviar o comentário:', error)
        }
    }

    return (
        <Box bgColor='white' h='100%' w='700px' rounded='3xl' boxShadow='rgba(0, 0, 0, 0.4) 0px 30px 90px' mt='20px'>
            <Flex justifyContent='center' alignItems='center' height='100%' flexDir='column' textAlign='center'>
                <Box onClick={onCommentModalOpen}>
                    <>
                        <Text>User ID: {userId}</Text>
                        <Text>ID: {id}</Text>
                        <Text>Title: {title}</Text>
                        <Text>Body: {body}</Text>
                    </>
                </Box>
                <Button mr='20px' onClick={onActionsModalOpen} >
                    Ações
                </Button>
                <Modal isOpen={isActionsModalOpen} onClose={onActionsModalClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Ações</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody >
                            Aqui é o menu de ações
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onActionsModalClose}>
                                Cancelar
                            </Button>
                            <Button colorScheme='red' onClick={onConfirmModalOpen}>
                                Excluir
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Modal isOpen={isConfirmModalOpen} onClose={onConfirmModalClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Confirmação</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody >
                            Atenção! Ao excluir esta postagem os comentários também serão excluídos
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='red' onClick={handleDelete}>Confirmar Exclusão</Button>
                            <Button colorScheme='blue' ml={3} onClick={onConfirmModalClose}>
                                Cancelar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                {/* <Modal isOpen={isCommentModalOpen} onClose={onCommentModalClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Comentários</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Input placeholder="Novo Comentário" mt="20px" value={comment || ''} onChange={(e) => setComment(e.target.value)} />
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" onClick={handleNewComment}>
                                Adicionar Comentário
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal> */}
                <Modal isOpen={isCommentModalOpen} onClose={onCommentModalClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Comentários</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Input placeholder="Novo Comentário" value={comment || ''} onChange={(e) => setComment(e.target.value)} />

                            <Text fontWeight="bold" mb={2}>Comentários:</Text>
                            {comments.length === 0 ? (
                                <Text>Nenhum comentário ainda.</Text>
                            ) : (
                                comments.map((comment, index) => (
                                    <Text key={index}>{comment}</Text>
                                ))
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" onClick={handleNewComment}>
                                Adicionar Comentário
                            </Button>
                            <Button ml={3} onClick={onCommentModalClose}>Cancelar</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Flex>
        </Box >
    )
}

export default Post
