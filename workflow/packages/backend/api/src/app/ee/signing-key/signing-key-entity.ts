import { EntitySchema } from 'typeorm'
import { KeyAlgorithm, SigningKey } from 'workflow-axb-shared'
import { Platform } from 'workflow-shared'
import { ApIdSchema, BaseColumnSchemaPart } from '../../database/database-common'

type SigningKeySchema = SigningKey & {
    platform: Platform
}

export const SigningKeyEntity = new EntitySchema<SigningKeySchema>({
    name: 'signing_key',
    columns: {
        ...BaseColumnSchemaPart,
        displayName: {
            type: String,
            nullable: false,
        },
        platformId: {
            ...ApIdSchema,
            nullable: false,
        },
        publicKey: {
            type: String,
            nullable: false,
        },
        algorithm: {
            type: String,
            enum: KeyAlgorithm,
            nullable: false,
        },
    },
    indices: [],
    relations: {
        platform: {
            type: 'many-to-one',
            target: 'platform',
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT',
            joinColumn: {
                name: 'platformId',
                referencedColumnName: 'id',
                foreignKeyConstraintName: 'fk_signing_key_platform_id',
            },
        },
    },
})
