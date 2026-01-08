import { COLLECTION_SLUG_TAXONOMY } from "@nexo-labs/payload-taxonomies";
import { Field } from "payload";

export const permissionEvaluationField: Field = {
  type: 'row',
  fields: [
    {
        type: 'select',
        name: 'type_of_permissions',
        options: [
            { label: 'Todos', value: 'all' },
            { label: 'Permisos por roles', value: 'roles' },
            { label: 'Solo para usuarios sin roles', value: 'only_no_roles' },
            { label: 'Solo invitados', value: 'only_guess' },
        ],
        defaultValue: 'all',
        label: 'Tipo de permisos',
    },
    {
        type: 'relationship',
        name: 'permissions',
        relationTo: [COLLECTION_SLUG_TAXONOMY],
        hasMany: false,
        admin: {
            condition: (_, siblingData) => siblingData.type_of_permissions === 'roles',
        }
    }
  ]
}