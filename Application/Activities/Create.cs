using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;

            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // only adding it to memory, not the database yet so no async method is needed
                _context.Activities.Add(request.Activity);

                await _context.SaveChangesAsync();

                // this is like returning void
                // it signals to API controller that the command request has finished
                return Unit.Value;
            }
        }
    }
}