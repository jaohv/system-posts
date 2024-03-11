import { Box, Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import { useRef, useState, useEffect } from "react"
import { SettingsIcon } from "@chakra-ui/icons"
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

export interface CommentData {
    postId: number
    id: number
    name: string
    email: string
    body: string
}

function Post({ data, onDelete }: PostProps) {
    const { userId, id, title, body } = data
    const commentRef = useRef<HTMLInputElement>(null);
    const [comments, setComments] = useState<CommentData[]>([])
    const { isOpen: isActionsModalOpen, onOpen: onActionsModalOpen, onClose: onActionsModalClose } = useDisclosure()
    const { isOpen: isConfirmModalOpen, onOpen: onConfirmModalOpen, onClose: onConfirmModalClose } = useDisclosure()
    const { isOpen: isCommentModalOpen, onOpen: onCommentModalOpen, onClose: onCommentModalClose } = useDisclosure()

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(`comments?postId=${id}`)
                setComments(response.data)
            } catch (error) {
                console.log('Erro ao buscar comentários:', error)
            }
        };
        fetchComments()
    }, [id])

    const handleDelete = async () => {
        onDelete(id)
        setComments([])
        onConfirmModalClose()
        onActionsModalClose()
    }

    const handleNewComment = async () => {
        try {
            const requestBody = {
                postId: id,
                id: comments.length + 1,
                name: "Psicomanager",
                email: "psicomanager@gmail.com",
                body: commentRef.current!.value
            }

            await api.post('comments', requestBody)

            setComments(prevComments => [...prevComments, requestBody]);
            onCommentModalClose()
            onActionsModalClose()
        } catch (error) {
            console.log('Erro ao enviar o comentário:', error)
        }
    }

    return (
        <Box bgColor='white' h='100%' maxW='700px' rounded='3xl' boxShadow='rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset' mt='50px' p={5} onClick={onCommentModalOpen}>
            <Flex justify='center' align='center' h='100%' flexDir='column'>
                <Flex flexDir='row' justify='space-between' w='100%'>
                    <Flex flexDir='column'>
                        <Flex gap={1}>
                            <Text fontWeight={700} fontSize='2xl'>
                                User:
                            </Text>
                            <Text fontSize='2xl'>
                                {userId}
                            </Text>
                        </Flex>
                        <Text>ID: {id}</Text>
                    </Flex>
                    <Button variant='ghost' mr='20px' onClick={(e) => { e.stopPropagation(); onActionsModalOpen() }}>
                        <SettingsIcon />
                    </Button>
                </Flex>
                <Flex>
                    <Flex flexDir='column' textAlign='center'>
                        <Text fontSize='2xl' fontWeight={700}>{title}</Text>
                        <Text>{body}</Text>
                    </Flex>
                </Flex>
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
                <Modal isOpen={isCommentModalOpen} onClose={onCommentModalClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Comentários</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Input placeholder="Novo Comentário" ref={commentRef} />
                            <Text fontWeight="bold" mb={2} mt={2}>Comentários:</Text>
                            {comments.length === 0 ? (
                                <Text>Nenhum comentário ainda.</Text>
                            ) : (
                                comments.map((comment, index) => (
                                    <Box key={index} borderWidth="1px" borderRadius="lg" p="4" my="2">
                                        <Text fontWeight="bold">{comment.name} ({comment.email})</Text>
                                        <Text>{comment.body}</Text>
                                    </Box>
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
